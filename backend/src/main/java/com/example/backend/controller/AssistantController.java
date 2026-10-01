package com.example.backend.controller;

import com.example.backend.entity.Assistant;
import com.example.backend.service.AssistantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantController {

    private final AssistantService service;

    public AssistantController(AssistantService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Assistant>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Assistant_id}")
    public ResponseEntity<Assistant> getById(@PathVariable Integer Assistant_id) {
        return ResponseEntity.ok(service.getById(Assistant_id));
    }

    @PostMapping
    public ResponseEntity<Assistant> create(@RequestBody Assistant entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Assistant_id}")
    public ResponseEntity<Assistant> update(
            @PathVariable Integer Assistant_id,
            @RequestBody Assistant entity) {
        return ResponseEntity.ok(service.update(Assistant_id, entity));
    }

    @DeleteMapping("/{Assistant_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Assistant_id) {
        service.delete(Assistant_id);
        return ResponseEntity.noContent().build();
    }
}
