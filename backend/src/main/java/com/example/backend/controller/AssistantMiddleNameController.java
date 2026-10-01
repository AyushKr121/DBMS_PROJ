package com.example.backend.controller;

import com.example.backend.entity.AssistantMiddleName;
import com.example.backend.service.AssistantMiddleNameService;
import com.example.backend.entity.id.AssistantMiddleNameId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-middle-name")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantMiddleNameController {

    private final AssistantMiddleNameService service;

    public AssistantMiddleNameController(AssistantMiddleNameService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantMiddleName>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Sequence_No}/{Assistant_id}")
    public ResponseEntity<AssistantMiddleName> getById(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Assistant_id) {
        return ResponseEntity.ok(service.getById(new AssistantMiddleNameId(Sequence_No, Assistant_id)));
    }

    @PostMapping
    public ResponseEntity<AssistantMiddleName> create(@RequestBody AssistantMiddleName entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Sequence_No}/{Assistant_id}")
    public ResponseEntity<AssistantMiddleName> update(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Assistant_id,
            @RequestBody AssistantMiddleName entity) {
        return ResponseEntity.ok(service.update(new AssistantMiddleNameId(Sequence_No, Assistant_id), entity));
    }

    @DeleteMapping("/{Sequence_No}/{Assistant_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Sequence_No,
            @PathVariable Integer Assistant_id) {
        service.delete(new AssistantMiddleNameId(Sequence_No, Assistant_id));
        return ResponseEntity.noContent().build();
    }
}
