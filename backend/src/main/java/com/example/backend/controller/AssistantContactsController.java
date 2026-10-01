package com.example.backend.controller;

import com.example.backend.entity.AssistantContacts;
import com.example.backend.service.AssistantContactsService;
import com.example.backend.entity.id.AssistantContactsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-contacts")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantContactsController {

    private final AssistantContactsService service;

    public AssistantContactsController(AssistantContactsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantContacts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Assistant_id}/{Phone_no}")
    public ResponseEntity<AssistantContacts> getById(
            @PathVariable Integer Assistant_id,
            @PathVariable String Phone_no) {
        return ResponseEntity.ok(service.getById(new AssistantContactsId(Assistant_id, Phone_no)));
    }

    @PostMapping
    public ResponseEntity<AssistantContacts> create(@RequestBody AssistantContacts entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Assistant_id}/{Phone_no}")
    public ResponseEntity<AssistantContacts> update(
            @PathVariable Integer Assistant_id,
            @PathVariable String Phone_no,
            @RequestBody AssistantContacts entity) {
        return ResponseEntity.ok(service.update(new AssistantContactsId(Assistant_id, Phone_no), entity));
    }

    @DeleteMapping("/{Assistant_id}/{Phone_no}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Assistant_id,
            @PathVariable String Phone_no) {
        service.delete(new AssistantContactsId(Assistant_id, Phone_no));
        return ResponseEntity.noContent().build();
    }
}
