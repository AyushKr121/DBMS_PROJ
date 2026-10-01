package com.example.backend.controller;

import com.example.backend.entity.TeacherSalaryRecords;
import com.example.backend.service.TeacherSalaryRecordsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-salary-records")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherSalaryRecordsController {

    private final TeacherSalaryRecordsService service;

    public TeacherSalaryRecordsController(TeacherSalaryRecordsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherSalaryRecords>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Receipt_id}")
    public ResponseEntity<TeacherSalaryRecords> getById(@PathVariable Integer Receipt_id) {
        return ResponseEntity.ok(service.getById(Receipt_id));
    }

    @PostMapping
    public ResponseEntity<TeacherSalaryRecords> create(@RequestBody TeacherSalaryRecords entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Receipt_id}")
    public ResponseEntity<TeacherSalaryRecords> update(
            @PathVariable Integer Receipt_id,
            @RequestBody TeacherSalaryRecords entity) {
        return ResponseEntity.ok(service.update(Receipt_id, entity));
    }

    @DeleteMapping("/{Receipt_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Receipt_id) {
        service.delete(Receipt_id);
        return ResponseEntity.noContent().build();
    }
}
