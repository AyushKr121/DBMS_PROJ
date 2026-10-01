package com.example.backend.controller;

import com.example.backend.entity.TeacherAttendanceRecord;
import com.example.backend.service.TeacherAttendanceRecordService;
import com.example.backend.entity.id.TeacherAttendanceRecordId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-attendance-record")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherAttendanceRecordController {

    private final TeacherAttendanceRecordService service;

    public TeacherAttendanceRecordController(TeacherAttendanceRecordService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherAttendanceRecord>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Date}/{Teacher_id}")
    public ResponseEntity<TeacherAttendanceRecord> getById(
            @PathVariable LocalDate Date,
            @PathVariable Integer Teacher_id) {
        return ResponseEntity.ok(service.getById(new TeacherAttendanceRecordId(Date, Teacher_id)));
    }

    @PostMapping
    public ResponseEntity<TeacherAttendanceRecord> create(@RequestBody TeacherAttendanceRecord entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Date}/{Teacher_id}")
    public ResponseEntity<TeacherAttendanceRecord> update(
            @PathVariable LocalDate Date,
            @PathVariable Integer Teacher_id,
            @RequestBody TeacherAttendanceRecord entity) {
        return ResponseEntity.ok(service.update(new TeacherAttendanceRecordId(Date, Teacher_id), entity));
    }

    @DeleteMapping("/{Date}/{Teacher_id}")
    public ResponseEntity<Void> delete(
            @PathVariable LocalDate Date,
            @PathVariable Integer Teacher_id) {
        service.delete(new TeacherAttendanceRecordId(Date, Teacher_id));
        return ResponseEntity.noContent().build();
    }
}
