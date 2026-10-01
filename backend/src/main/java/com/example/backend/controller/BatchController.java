package com.example.backend.controller;

import com.example.backend.entity.Batch;
import com.example.backend.service.BatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = "http://localhost:5173")
public class BatchController {

    private final BatchService service;

    public BatchController(BatchService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Batch>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Batch_id}")
    public ResponseEntity<Batch> getById(@PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(Batch_id));
    }

    @PostMapping
    public ResponseEntity<Batch> create(@RequestBody Batch entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Batch_id}")
    public ResponseEntity<Batch> update(
            @PathVariable Integer Batch_id,
            @RequestBody Batch entity) {
        return ResponseEntity.ok(service.update(Batch_id, entity));
    }

    @DeleteMapping("/{Batch_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Batch_id) {
        service.delete(Batch_id);
        return ResponseEntity.noContent().build();
    }
}
