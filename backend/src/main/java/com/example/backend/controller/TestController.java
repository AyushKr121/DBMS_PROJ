package com.example.backend.controller;

import com.example.backend.entity.Test;
import com.example.backend.service.TestService;
import com.example.backend.entity.id.TestId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    private final TestService service;

    public TestController(TestService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Test>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Test_id}/{Batch_id}")
    public ResponseEntity<Test> getById(
            @PathVariable Integer Test_id,
            @PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(new TestId(Test_id, Batch_id)));
    }

    @PostMapping
    public ResponseEntity<Test> create(@RequestBody Test entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Test_id}/{Batch_id}")
    public ResponseEntity<Test> update(
            @PathVariable Integer Test_id,
            @PathVariable Integer Batch_id,
            @RequestBody Test entity) {
        return ResponseEntity.ok(service.update(new TestId(Test_id, Batch_id), entity));
    }

    @DeleteMapping("/{Test_id}/{Batch_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Test_id,
            @PathVariable Integer Batch_id) {
        service.delete(new TestId(Test_id, Batch_id));
        return ResponseEntity.noContent().build();
    }
}
