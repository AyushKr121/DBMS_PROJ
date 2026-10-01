package com.example.backend.controller;

import com.example.backend.entity.Schedule;
import com.example.backend.service.ScheduleService;
import com.example.backend.entity.id.ScheduleId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Day}/{Batch_id}")
    public ResponseEntity<Schedule> getById(
            @PathVariable String Day,
            @PathVariable Integer Batch_id) {
        return ResponseEntity.ok(service.getById(new ScheduleId(Day, Batch_id)));
    }

    @PostMapping
    public ResponseEntity<Schedule> create(@RequestBody Schedule entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Day}/{Batch_id}")
    public ResponseEntity<Schedule> update(
            @PathVariable String Day,
            @PathVariable Integer Batch_id,
            @RequestBody Schedule entity) {
        return ResponseEntity.ok(service.update(new ScheduleId(Day, Batch_id), entity));
    }

    @DeleteMapping("/{Day}/{Batch_id}")
    public ResponseEntity<Void> delete(
            @PathVariable String Day,
            @PathVariable Integer Batch_id) {
        service.delete(new ScheduleId(Day, Batch_id));
        return ResponseEntity.noContent().build();
    }
}
