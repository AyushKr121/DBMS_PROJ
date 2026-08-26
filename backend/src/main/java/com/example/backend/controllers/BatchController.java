package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Domain        : Academics
 * Entities      : Batch, Schedule
 * Base route    : /api/batches
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/batches                              createBatch
 * GET     /api/batches                              getAllBatches
 * GET     /api/batches/{batch_id}                   getBatchById
 * PUT     /api/batches/{batch_id}                   updateBatch
 * DELETE  /api/batches/{batch_id}                   deleteBatch
 * POST    /api/batches/{batch_id}/schedule           addBatchSchedule
 * GET     /api/batches/{batch_id}/schedule           getBatchSchedule
 * DELETE  /api/batches/{batch_id}/schedule/{day}     deleteBatchSchedule
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    // ------------------------------------------------------------------ Batch ----

    @PostMapping
    public ResponseEntity<Object> createBatch(@RequestBody BatchRequest request) {
        Object created = batchService.createBatch(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/{batch_id}")
    public ResponseEntity<Object> getBatchById(@PathVariable("batch_id") Long batchId) {
        return batchService.getBatchById(batchId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{batch_id}")
    public ResponseEntity<Object> updateBatch(@PathVariable("batch_id") Long batchId,
                                               @RequestBody BatchRequest request) {
        return batchService.updateBatch(batchId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{batch_id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable("batch_id") Long batchId) {
        boolean deleted = batchService.deleteBatch(batchId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --------------------------------------------------------------- Schedule ----

    @PostMapping("/{batch_id}/schedule")
    public ResponseEntity<Object> addBatchSchedule(@PathVariable("batch_id") Long batchId,
                                                     @RequestBody ScheduleRequest request) {
        Object schedule = batchService.addBatchSchedule(batchId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(schedule);
    }

    @GetMapping("/{batch_id}/schedule")
    public ResponseEntity<List<Object>> getBatchSchedule(@PathVariable("batch_id") Long batchId) {
        return ResponseEntity.ok(batchService.getBatchSchedule(batchId));
    }

    @DeleteMapping("/{batch_id}/schedule/{day}")
    public ResponseEntity<Void> deleteBatchSchedule(@PathVariable("batch_id") Long batchId,
                                                      @PathVariable("day") String day) {
        boolean deleted = batchService.deleteBatchSchedule(batchId, day);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------------- DTOs -------

    public record BatchRequest(
            Long teacherId,
            Long courseId,
            LocalDate startDate,
            LocalTime startTime,
            LocalTime endTime,
            String venue,
            Integer modulesCompleted
    ) {}

    public record ScheduleRequest(String day) {}
}

/**
 * Service contract for {@link BatchController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface BatchService {

    Object createBatch(BatchController.BatchRequest request);

    List<Object> getAllBatches();

    java.util.Optional<Object> getBatchById(Long batchId);

    java.util.Optional<Object> updateBatch(Long batchId, BatchController.BatchRequest request);

    boolean deleteBatch(Long batchId);

    Object addBatchSchedule(Long batchId, BatchController.ScheduleRequest request);

    List<Object> getBatchSchedule(Long batchId);

    boolean deleteBatchSchedule(Long batchId, String day);
}
