package com.example.backend.controller;

import com.example.backend.entity.TeacherMiddleName;
import com.example.backend.service.TeacherMiddleNameService;
import com.example.backend.entity.id.TeacherMiddleNameId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-middle-name")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherMiddleNameController {

    private final TeacherMiddleNameService service;

    public TeacherMiddleNameController(TeacherMiddleNameService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherMiddleName>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Sequence_No}/{Teacher_id}")
    public ResponseEntity<TeacherMiddleName> getById(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Teacher_id) {
        return ResponseEntity.ok(service.getById(new TeacherMiddleNameId(Sequence_No, Teacher_id)));
    }

    @PostMapping
    public ResponseEntity<TeacherMiddleName> create(@RequestBody TeacherMiddleName entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Sequence_No}/{Teacher_id}")
    public ResponseEntity<TeacherMiddleName> update(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Teacher_id,
            @RequestBody TeacherMiddleName entity) {
        return ResponseEntity.ok(service.update(new TeacherMiddleNameId(Sequence_No, Teacher_id), entity));
    }

    @DeleteMapping("/{Sequence_No}/{Teacher_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Teacher_id) {
        service.delete(new TeacherMiddleNameId(Sequence_No, Teacher_id));
        return ResponseEntity.noContent().build();
    }
}
