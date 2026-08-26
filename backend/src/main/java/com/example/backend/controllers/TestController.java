package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Academics
 * Entities      : Test, Takes
 * Base route    : /api/tests (plus nested reads under /api/batches)
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/tests                                  createTest
 * GET     /api/batches/{batch_id}/tests               getBatchTests
 * PUT     /api/tests/{test_id}                        updateTest
 * DELETE  /api/tests/{test_id}                        deleteTest
 * POST    /api/tests/{test_id}/scores                 addTestScore
 * GET     /api/tests/{test_id}/scores                 getTestScores
 * PUT     /api/tests/{test_id}/scores/{student_id}    updateTestScore
 * --------------------------------------------------------------------------------
 */
@RestController
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    // ------------------------------------------------------------------- Test ----

    @PostMapping("/api/tests")
    public ResponseEntity<Object> createTest(@RequestBody TestRequest request) {
        Object created = testService.createTest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/batches/{batch_id}/tests")
    public ResponseEntity<List<Object>> getBatchTests(@PathVariable("batch_id") Long batchId) {
        return ResponseEntity.ok(testService.getBatchTests(batchId));
    }

    @PutMapping("/api/tests/{test_id}")
    public ResponseEntity<Object> updateTest(@PathVariable("test_id") Long testId,
                                              @RequestBody TestRequest request) {
        return testService.updateTest(testId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/tests/{test_id}")
    public ResponseEntity<Void> deleteTest(@PathVariable("test_id") Long testId) {
        boolean deleted = testService.deleteTest(testId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ------------------------------------------------------------------ Takes ----

    @PostMapping("/api/tests/{test_id}/scores")
    public ResponseEntity<Object> addTestScore(@PathVariable("test_id") Long testId,
                                                @RequestBody TestScoreRequest request) {
        Object score = testService.addTestScore(testId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(score);
    }

    @GetMapping("/api/tests/{test_id}/scores")
    public ResponseEntity<List<Object>> getTestScores(@PathVariable("test_id") Long testId) {
        return ResponseEntity.ok(testService.getTestScores(testId));
    }

    @PutMapping("/api/tests/{test_id}/scores/{student_id}")
    public ResponseEntity<Object> updateTestScore(@PathVariable("test_id") Long testId,
                                                   @PathVariable("student_id") Long studentId,
                                                   @RequestBody TestScoreUpdateRequest request) {
        return testService.updateTestScore(testId, studentId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- DTOs -------

    public record TestRequest(
            Long batchId,
            String testTitle,
            LocalDate date,
            String questionPaperLink,
            String answerKeyLink
    ) {}

    public record TestScoreRequest(Long studentId, Long batchId, Double score) {}

    public record TestScoreUpdateRequest(Double score) {}
}

/**
 * Service contract for {@link TestController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface TestService {

    Object createTest(TestController.TestRequest request);

    List<Object> getBatchTests(Long batchId);

    java.util.Optional<Object> updateTest(Long testId, TestController.TestRequest request);

    boolean deleteTest(Long testId);

    Object addTestScore(Long testId, TestController.TestScoreRequest request);

    List<Object> getTestScores(Long testId);

    java.util.Optional<Object> updateTestScore(Long testId, Long studentId, TestController.TestScoreUpdateRequest request);
}
