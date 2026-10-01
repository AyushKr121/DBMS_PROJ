package com.example.backend.controller;

import com.example.backend.entity.Admin;
import com.example.backend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Admin_id}")
    public ResponseEntity<Admin> getById(@PathVariable Integer Admin_id) {
        return ResponseEntity.ok(service.getById(Admin_id));
    }

    @PostMapping
    public ResponseEntity<Admin> create(@RequestBody Admin entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Admin_id}")
    public ResponseEntity<Admin> update(
            @PathVariable Integer Admin_id,
            @RequestBody Admin entity) {
        return ResponseEntity.ok(service.update(Admin_id, entity));
    }

    @DeleteMapping("/{Admin_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Admin_id) {
        service.delete(Admin_id);
        return ResponseEntity.noContent().build();
    }
}
