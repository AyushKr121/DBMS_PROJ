package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Academics
 * Entity        : Enrollment
 * Base route    : /api/enrollments (plus nested reads under /api/batches and /api/students)
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/enrollments                            enrollStudent
 * GET     /api/batches/{batch_id}/enrollments         getBatchEnrollments
 * GET     /api/students/{student_id}/enrollments      getStudentEnrollments
 * PUT     /api/enrollments                            updateEnrollment
 * --------------------------------------------------------------------------------
 */
@RestController
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/api/enrollments")
    public ResponseEntity<Object> enrollStudent(@RequestBody EnrollmentRequest request) {
        Object created = enrollmentService.enrollStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/batches/{batch_id}/enrollments")
    public ResponseEntity<List<Object>> getBatchEnrollments(@PathVariable("batch_id") Long batchId) {
        return ResponseEntity.ok(enrollmentService.getBatchEnrollments(batchId));
    }

    @GetMapping("/api/students/{student_id}/enrollments")
    public ResponseEntity<List<Object>> getStudentEnrollments(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }

    @PutMapping("/api/enrollments")
    public ResponseEntity<Object> updateEnrollment(@RequestBody EnrollmentUpdateRequest request) {
        return enrollmentService.updateEnrollment(request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- DTOs -------

    public record EnrollmentRequest(
            Long studentId,
            Long batchId,
            String batchNotificationStatus,
            LocalDate enrollmentDate,
            Double discount
    ) {}

    public record EnrollmentUpdateRequest(
            Long studentId,
            Long batchId,
            String feedback,
            String certificate,
            Double discount,
            String batchNotificationStatus
    ) {}
}

/**
 * Service contract for {@link EnrollmentController}.
 * Implement this as a @Service backed by your JPA repositories.
 * Enrollment has the composite key (Student_id, Batch_id).
 */
interface EnrollmentService {

    Object enrollStudent(EnrollmentController.EnrollmentRequest request);

    List<Object> getBatchEnrollments(Long batchId);

    List<Object> getStudentEnrollments(Long studentId);

    java.util.Optional<Object> updateEnrollment(EnrollmentController.EnrollmentUpdateRequest request);
}
