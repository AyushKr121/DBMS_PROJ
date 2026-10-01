package com.example.backend.controller;

import com.example.backend.entity.StudentAttendance;
import com.example.backend.service.StudentAttendanceService;
import com.example.backend.entity.id.StudentAttendanceId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/student-attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAttendanceController {

    private final StudentAttendanceService service;

    public StudentAttendanceController(StudentAttendanceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StudentAttendance>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Date}/{Student_id}/{Batch_id}")
    public ResponseEntity<StudentAttendance> getById(
            @PathVariable LocalDate Date,
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(new StudentAttendanceId(Date, Student_id, Batch_id)));
    }

    @PostMapping
    public ResponseEntity<StudentAttendance> create(@RequestBody StudentAttendance entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Date}/{Student_id}/{Batch_id}")
    public ResponseEntity<StudentAttendance> update(
            @PathVariable LocalDate Date,
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id,
            @RequestBody StudentAttendance entity) {
        return ResponseEntity.ok(service.update(new StudentAttendanceId(Date, Student_id, Batch_id), entity));
    }

    @DeleteMapping("/{Date}/{Student_id}/{Batch_id}")
    public ResponseEntity<Void> delete(
            @PathVariable LocalDate Date,
            @PathVariable Integer Student_id,
            @PathVariable Integer Batch_id) {
        service.delete(new StudentAttendanceId(Date, Student_id, Batch_id));
        return ResponseEntity.noContent().build();
    }
}
