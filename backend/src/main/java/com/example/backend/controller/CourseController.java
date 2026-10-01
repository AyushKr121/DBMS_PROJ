package com.example.backend.controller;

import com.example.backend.entity.Course;
import com.example.backend.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Course_id}")
    public ResponseEntity<Course> getById(@PathVariable Integer Course_id) {
        return ResponseEntity.ok(service.getById(Course_id));
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Course_id}")
    public ResponseEntity<Course> update(
            @PathVariable Integer Course_id,
            @RequestBody Course entity) {
        return ResponseEntity.ok(service.update(Course_id, entity));
    }

    @DeleteMapping("/{Course_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Course_id) {
        service.delete(Course_id);
        return ResponseEntity.noContent().build();
    }
}
