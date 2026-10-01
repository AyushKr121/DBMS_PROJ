package com.example.backend.controller;

import com.example.backend.entity.AdminMiddleName;
import com.example.backend.service.AdminMiddleNameService;
import com.example.backend.entity.id.AdminMiddleNameId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-middle-name")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminMiddleNameController {

    private final AdminMiddleNameService service;

    public AdminMiddleNameController(AdminMiddleNameService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AdminMiddleName>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Sequence_No}/{Admin_id}")
    public ResponseEntity<AdminMiddleName> getById(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Admin_id) {
        return ResponseEntity.ok(service.getById(new AdminMiddleNameId(Sequence_No, Admin_id)));
    }

    @PostMapping
    public ResponseEntity<AdminMiddleName> create(@RequestBody AdminMiddleName entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Sequence_No}/{Admin_id}")
    public ResponseEntity<AdminMiddleName> update(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Admin_id,
            @RequestBody AdminMiddleName entity) {
        return ResponseEntity.ok(service.update(new AdminMiddleNameId(Sequence_No, Admin_id), entity));
    }

    @DeleteMapping("/{Sequence_No}/{Admin_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Admin_id) {
        service.delete(new AdminMiddleNameId(Sequence_No, Admin_id));
        return ResponseEntity.noContent().build();
    }
}
