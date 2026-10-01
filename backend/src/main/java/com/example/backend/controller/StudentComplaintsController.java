package com.example.backend.controller;

import com.example.backend.entity.StudentComplaints;
import com.example.backend.service.StudentComplaintsService;
import com.example.backend.entity.id.StudentComplaintsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentComplaintsController {

    private final StudentComplaintsService service;

    public StudentComplaintsController(StudentComplaintsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StudentComplaints>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Complaint_id}/{Student_id}")
    public ResponseEntity<StudentComplaints> getById(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Student_id) {
        return ResponseEntity.ok(service.getById(new StudentComplaintsId(Complaint_id, Student_id)));
    }

    @PostMapping
    public ResponseEntity<StudentComplaints> create(@RequestBody StudentComplaints entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Complaint_id}/{Student_id}")
    public ResponseEntity<StudentComplaints> update(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Student_id,
            @RequestBody StudentComplaints entity) {
        return ResponseEntity.ok(service.update(new StudentComplaintsId(Complaint_id, Student_id), entity));
    }

    @DeleteMapping("/{Complaint_id}/{Student_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Student_id) {
        service.delete(new StudentComplaintsId(Complaint_id, Student_id));
        return ResponseEntity.noContent().build();
    }
}
