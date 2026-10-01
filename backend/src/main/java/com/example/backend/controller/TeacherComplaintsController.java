package com.example.backend.controller;

import com.example.backend.entity.TeacherComplaints;
import com.example.backend.service.TeacherComplaintsService;
import com.example.backend.entity.id.TeacherComplaintsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherComplaintsController {

    private final TeacherComplaintsService service;

    public TeacherComplaintsController(TeacherComplaintsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherComplaints>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Complaint_id}/{Teacher_id}")
    public ResponseEntity<TeacherComplaints> getById(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Teacher_id) {
        return ResponseEntity.ok(service.getById(new TeacherComplaintsId(Complaint_id, Teacher_id)));
    }

    @PostMapping
    public ResponseEntity<TeacherComplaints> create(@RequestBody TeacherComplaints entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Complaint_id}/{Teacher_id}")
    public ResponseEntity<TeacherComplaints> update(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Teacher_id,
            @RequestBody TeacherComplaints entity) {
        return ResponseEntity.ok(service.update(new TeacherComplaintsId(Complaint_id, Teacher_id), entity));
    }

    @DeleteMapping("/{Complaint_id}/{Teacher_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Teacher_id) {
        service.delete(new TeacherComplaintsId(Complaint_id, Teacher_id));
        return ResponseEntity.noContent().build();
    }
}
