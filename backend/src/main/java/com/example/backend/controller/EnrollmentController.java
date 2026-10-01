package com.example.backend.controller;

import com.example.backend.entity.Enrollment;
import com.example.backend.service.EnrollmentService;
import com.example.backend.entity.id.EnrollmentId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Student_id}/{Batch_id}")
    public ResponseEntity<Enrollment> getById(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(new EnrollmentId(Student_id, Batch_id)));
    }

    @PostMapping
    public ResponseEntity<Enrollment> create(@RequestBody Enrollment entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Student_id}/{Batch_id}")
    public ResponseEntity<Enrollment> update(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id,
            @RequestBody Enrollment entity) {
        return ResponseEntity.ok(service.update(new EnrollmentId(Student_id, Batch_id), entity));
    }

    @DeleteMapping("/{Student_id}/{Batch_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id) {
        service.delete(new EnrollmentId(Student_id, Batch_id));
        return ResponseEntity.noContent().build();
    }
}
