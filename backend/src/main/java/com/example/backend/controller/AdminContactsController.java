package com.example.backend.controller;

import com.example.backend.entity.AdminContacts;
import com.example.backend.service.AdminContactsService;
import com.example.backend.entity.id.AdminContactsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-contacts")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminContactsController {

    private final AdminContactsService service;

    public AdminContactsController(AdminContactsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AdminContacts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Admin_id}/{Phone_no}")
    public ResponseEntity<AdminContacts> getById(
            @PathVariable Integer Admin_id,
            @PathVariable String Phone_no) {
        return ResponseEntity.ok(service.getById(new AdminContactsId(Admin_id, Phone_no)));
    }

    @PostMapping
    public ResponseEntity<AdminContacts> create(@RequestBody AdminContacts entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Admin_id}/{Phone_no}")
    public ResponseEntity<AdminContacts> update(
            @PathVariable Integer Admin_id,
            @PathVariable String Phone_no,
            @RequestBody AdminContacts entity) {
        return ResponseEntity.ok(service.update(new AdminContactsId(Admin_id, Phone_no), entity));
    }

    @DeleteMapping("/{Admin_id}/{Phone_no}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Admin_id,
            @PathVariable String Phone_no) {
        service.delete(new AdminContactsId(Admin_id, Phone_no));
        return ResponseEntity.noContent().build();
    }
}
