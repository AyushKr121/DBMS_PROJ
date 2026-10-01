package com.example.backend.controller;

import com.example.backend.entity.TeacherContacts;
import com.example.backend.service.TeacherContactsService;
import com.example.backend.entity.id.TeacherContactsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-contacts")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherContactsController {

    private final TeacherContactsService service;

    public TeacherContactsController(TeacherContactsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherContacts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Teacher_id}/{Phone_no}")
    public ResponseEntity<TeacherContacts> getById(
            @PathVariable Integer Teacher_id,
            @PathVariable String Phone_no) {
        return ResponseEntity.ok(service.getById(new TeacherContactsId(Teacher_id, Phone_no)));
    }

    @PostMapping
    public ResponseEntity<TeacherContacts> create(@RequestBody TeacherContacts entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Teacher_id}/{Phone_no}")
    public ResponseEntity<TeacherContacts> update(
            @PathVariable Integer Teacher_id,
            @PathVariable String Phone_no,
            @RequestBody TeacherContacts entity) {
        return ResponseEntity.ok(service.update(new TeacherContactsId(Teacher_id, Phone_no), entity));
    }

    @DeleteMapping("/{Teacher_id}/{Phone_no}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Teacher_id,
            @PathVariable String Phone_no) {
        service.delete(new TeacherContactsId(Teacher_id, Phone_no));
        return ResponseEntity.noContent().build();
    }
}
