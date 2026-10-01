package com.example.backend.controller;

import com.example.backend.entity.Takes;
import com.example.backend.service.TakesService;
import com.example.backend.entity.id.TakesId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/takes")
@CrossOrigin(origins = "http://localhost:5173")
public class TakesController {

    private final TakesService service;

    public TakesController(TakesService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Takes>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Student_id}/{Batch_id}/{Test_id}")
    public ResponseEntity<Takes> getById(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id,
            @PathVariable Integer Test_id) {
        return ResponseEntity.ok(service.getById(new TakesId(Student_id, Batch_id, Test_id)));
    }

    @PostMapping
    public ResponseEntity<Takes> create(@RequestBody Takes entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Student_id}/{Batch_id}/{Test_id}")
    public ResponseEntity<Takes> update(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id,
            @PathVariable Integer Test_id,
            @RequestBody Takes entity) {
        return ResponseEntity.ok(service.update(new TakesId(Student_id, Batch_id, Test_id), entity));
    }

    @DeleteMapping("/{Student_id}/{Batch_id}/{Test_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id,
            @PathVariable Integer Test_id) {
        service.delete(new TakesId(Student_id, Batch_id, Test_id));
        return ResponseEntity.noContent().build();
    }
}
