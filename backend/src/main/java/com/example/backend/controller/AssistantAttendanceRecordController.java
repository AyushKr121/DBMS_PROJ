package com.example.backend.controller;

import com.example.backend.entity.AssistantAttendanceRecord;
import com.example.backend.service.AssistantAttendanceRecordService;
import com.example.backend.entity.id.AssistantAttendanceRecordId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-attendance-record")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantAttendanceRecordController {

    private final AssistantAttendanceRecordService service;

    public AssistantAttendanceRecordController(AssistantAttendanceRecordService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantAttendanceRecord>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Date}/{Assistant_id}")
    public ResponseEntity<AssistantAttendanceRecord> getById(
            @PathVariable LocalDate Date,
            @PathVariable Integer Assistant_id) {
        return ResponseEntity.ok(service.getById(new AssistantAttendanceRecordId(Date, Assistant_id)));
    }

    @PostMapping
    public ResponseEntity<AssistantAttendanceRecord> create(@RequestBody AssistantAttendanceRecord entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Date}/{Assistant_id}")
    public ResponseEntity<AssistantAttendanceRecord> update(
            @PathVariable LocalDate Date,
            @PathVariable Integer Assistant_id,
            @RequestBody AssistantAttendanceRecord entity) {
        return ResponseEntity.ok(service.update(new AssistantAttendanceRecordId(Date, Assistant_id), entity));
    }

    @DeleteMapping("/{Date}/{Assistant_id}")
    public ResponseEntity<Void> delete(
            @PathVariable LocalDate Date,
            @PathVariable Integer Assistant_id) {
        service.delete(new AssistantAttendanceRecordId(Date, Assistant_id));
        return ResponseEntity.noContent().build();
    }
}
