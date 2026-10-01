package com.example.backend.controller;

import com.example.backend.entity.Teacher;
import com.example.backend.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherService service;

    public TeacherController(TeacherService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Teacher_id}")
    public ResponseEntity<Teacher> getById(@PathVariable Integer Teacher_id) {
        return ResponseEntity.ok(service.getById(Teacher_id));
    }

    @PostMapping
    public ResponseEntity<Teacher> create(@RequestBody Teacher entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Teacher_id}")
    public ResponseEntity<Teacher> update(
            @PathVariable Integer Teacher_id,
            @RequestBody Teacher entity) {
        return ResponseEntity.ok(service.update(Teacher_id, entity));
    }

    @DeleteMapping("/{Teacher_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Teacher_id) {
        service.delete(Teacher_id);
        return ResponseEntity.noContent().build();
    }
}
