package com.example.backend.controller;

import com.example.backend.entity.StudentContacts;
import com.example.backend.service.StudentContactsService;
import com.example.backend.entity.id.StudentContactsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-contacts")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentContactsController {

    private final StudentContactsService service;

    public StudentContactsController(StudentContactsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StudentContacts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Student_id}/{Phone_no}")
    public ResponseEntity<StudentContacts> getById(
            @PathVariable Integer Student_id,
            @PathVariable String Phone_no) {
        return ResponseEntity.ok(service.getById(new StudentContactsId(Student_id, Phone_no)));
    }

    @PostMapping
    public ResponseEntity<StudentContacts> create(@RequestBody StudentContacts entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Student_id}/{Phone_no}")
    public ResponseEntity<StudentContacts> update(
            @PathVariable Integer Student_id,
            @PathVariable String Phone_no,
            @RequestBody StudentContacts entity) {
        return ResponseEntity.ok(service.update(new StudentContactsId(Student_id, Phone_no), entity));
    }

    @DeleteMapping("/{Student_id}/{Phone_no}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Student_id,
            @PathVariable String Phone_no) {
        service.delete(new StudentContactsId(Student_id, Phone_no));
        return ResponseEntity.noContent().build();
    }
}
