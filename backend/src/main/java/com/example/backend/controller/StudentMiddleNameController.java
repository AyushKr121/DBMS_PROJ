package com.example.backend.controller;

import com.example.backend.entity.StudentMiddleName;
import com.example.backend.service.StudentMiddleNameService;
import com.example.backend.entity.id.StudentMiddleNameId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-middle-name")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentMiddleNameController {

    private final StudentMiddleNameService service;

    public StudentMiddleNameController(StudentMiddleNameService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StudentMiddleName>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Sequence_No}/{Student_id}")
    public ResponseEntity<StudentMiddleName> getById(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Student_id) {
        return ResponseEntity.ok(service.getById(new StudentMiddleNameId(Sequence_No, Student_id)));
    }

    @PostMapping
    public ResponseEntity<StudentMiddleName> create(@RequestBody StudentMiddleName entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Sequence_No}/{Student_id}")
    public ResponseEntity<StudentMiddleName> update(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Student_id,
            @RequestBody StudentMiddleName entity) {
        return ResponseEntity.ok(service.update(new StudentMiddleNameId(Sequence_No, Student_id), entity));
    }

    @DeleteMapping("/{Sequence_No}/{Student_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Student_id) {
        service.delete(new StudentMiddleNameId(Sequence_No, Student_id));
        return ResponseEntity.noContent().build();
    }
}
