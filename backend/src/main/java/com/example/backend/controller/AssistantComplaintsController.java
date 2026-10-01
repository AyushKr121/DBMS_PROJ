package com.example.backend.controller;

import com.example.backend.entity.AssistantComplaints;
import com.example.backend.service.AssistantComplaintsService;
import com.example.backend.entity.id.AssistantComplaintsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantComplaintsController {

    private final AssistantComplaintsService service;

    public AssistantComplaintsController(AssistantComplaintsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantComplaints>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Complaint_id}/{Assistant_id}")
    public ResponseEntity<AssistantComplaints> getById(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Assistant_id) {
        return ResponseEntity.ok(service.getById(new AssistantComplaintsId(Complaint_id, Assistant_id)));
    }

    @PostMapping
    public ResponseEntity<AssistantComplaints> create(@RequestBody AssistantComplaints entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Complaint_id}/{Assistant_id}")
    public ResponseEntity<AssistantComplaints> update(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Assistant_id,
            @RequestBody AssistantComplaints entity) {
        return ResponseEntity.ok(service.update(new AssistantComplaintsId(Complaint_id, Assistant_id), entity));
    }

    @DeleteMapping("/{Complaint_id}/{Assistant_id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Complaint_id,
            @PathVariable Integer Assistant_id) {
        service.delete(new AssistantComplaintsId(Complaint_id, Assistant_id));
        return ResponseEntity.noContent().build();
    }
}
