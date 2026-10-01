package com.example.backend.controller;

import com.example.backend.entity.TeacherSalaryDetails;
import com.example.backend.service.TeacherSalaryDetailsService;
import com.example.backend.entity.id.TeacherSalaryDetailsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-salary-details")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherSalaryDetailsController {

    private final TeacherSalaryDetailsService service;

    public TeacherSalaryDetailsController(TeacherSalaryDetailsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeacherSalaryDetails>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<TeacherSalaryDetails> getById(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        return ResponseEntity.ok(service.getById(new TeacherSalaryDetailsId(Receipt_id, Description)));
    }

    @PostMapping
    public ResponseEntity<TeacherSalaryDetails> create(@RequestBody TeacherSalaryDetails entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<TeacherSalaryDetails> update(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description,
            @RequestBody TeacherSalaryDetails entity) {
        return ResponseEntity.ok(service.update(new TeacherSalaryDetailsId(Receipt_id, Description), entity));
    }

    @DeleteMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        service.delete(new TeacherSalaryDetailsId(Receipt_id, Description));
        return ResponseEntity.noContent().build();
    }
}
