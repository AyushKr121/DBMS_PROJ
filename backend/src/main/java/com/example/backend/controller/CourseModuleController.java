package com.example.backend.controller;

import com.example.backend.entity.CourseModule;
import com.example.backend.service.CourseModuleService;
import com.example.backend.entity.id.CourseModuleId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-module")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseModuleController {

    private final CourseModuleService service;

    public CourseModuleController(CourseModuleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CourseModule>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Module_id}/{Course_id}")
    public ResponseEntity<CourseModule> getById(
            @PathVariable Integer Module_id,
            @PathVariable Integer Course_id) {
        return ResponseEntity.ok(service.getById(new CourseModuleId(Module_id, Course_id)));
    }

    @PostMapping
    public ResponseEntity<CourseModule> create(@RequestBody CourseModule entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Module_id}/{Course_id}")
    public ResponseEntity<CourseModule> update(
            @PathVariable Integer Module_id,
            @PathVariable Integer Course_id,
            @RequestBody CourseModule entity) {
        return ResponseEntity.ok(service.update(new CourseModuleId(Module_id, Course_id), entity));
    }

    @DeleteMapping("/{Module_id}/{Course_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Module_id,
            @PathVariable Integer Course_id) {
        service.delete(new CourseModuleId(Module_id, Course_id));
        return ResponseEntity.noContent().build();
    }
}
