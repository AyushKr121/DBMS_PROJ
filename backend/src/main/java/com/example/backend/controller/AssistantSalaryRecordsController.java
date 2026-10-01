package com.example.backend.controller;

import com.example.backend.entity.AssistantSalaryRecords;
import com.example.backend.service.AssistantSalaryRecordsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-salary-records")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantSalaryRecordsController {

    private final AssistantSalaryRecordsService service;

    public AssistantSalaryRecordsController(AssistantSalaryRecordsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantSalaryRecords>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Receipt_id}")
    public ResponseEntity<AssistantSalaryRecords> getById(@PathVariable Integer Receipt_id) {
        return ResponseEntity.ok(service.getById(Receipt_id));
    }

    @PostMapping
    public ResponseEntity<AssistantSalaryRecords> create(@RequestBody AssistantSalaryRecords entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Receipt_id}")
    public ResponseEntity<AssistantSalaryRecords> update(
            @PathVariable Integer Receipt_id,
            @RequestBody AssistantSalaryRecords entity) {
        return ResponseEntity.ok(service.update(Receipt_id, entity));
    }

    @DeleteMapping("/{Receipt_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Receipt_id) {
        service.delete(Receipt_id);
        return ResponseEntity.noContent().build();
    }
}
