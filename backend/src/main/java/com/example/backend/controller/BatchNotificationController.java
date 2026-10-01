package com.example.backend.controller;

import com.example.backend.entity.BatchNotification;
import com.example.backend.service.BatchNotificationService;
import com.example.backend.entity.id.BatchNotificationId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batch-notification")
@CrossOrigin(origins = "http://localhost:5173")
public class BatchNotificationController {

    private final BatchNotificationService service;

    public BatchNotificationController(BatchNotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<BatchNotification>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Notification_id}/{Batch_id}")
    public ResponseEntity<BatchNotification> getById(
            @PathVariable Integer Notification_id,
            @PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(new BatchNotificationId(Notification_id, Batch_id)));
    }

    @PostMapping
    public ResponseEntity<BatchNotification> create(@RequestBody BatchNotification entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Notification_id}/{Batch_id}")
    public ResponseEntity<BatchNotification> update(
            @PathVariable Integer Notification_id,
            @PathVariable Integer Batch_id,
            @RequestBody BatchNotification entity) {
        return ResponseEntity.ok(service.update(new BatchNotificationId(Notification_id, Batch_id), entity));
    }

    @DeleteMapping("/{Notification_id}/{Batch_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Notification_id,
            @PathVariable Integer Batch_id) {
        service.delete(new BatchNotificationId(Notification_id, Batch_id));
        return ResponseEntity.noContent().build();
    }
}
