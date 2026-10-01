package com.example.backend.controller;

import com.example.backend.entity.AssistantSalaryDetails;
import com.example.backend.service.AssistantSalaryDetailsService;
import com.example.backend.entity.id.AssistantSalaryDetailsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-salary-details")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantSalaryDetailsController {

    private final AssistantSalaryDetailsService service;

    public AssistantSalaryDetailsController(AssistantSalaryDetailsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantSalaryDetails>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<AssistantSalaryDetails> getById(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        return ResponseEntity.ok(service.getById(new AssistantSalaryDetailsId(Receipt_id, Description)));
    }

    @PostMapping
    public ResponseEntity<AssistantSalaryDetails> create(@RequestBody AssistantSalaryDetails entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<AssistantSalaryDetails> update(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description,
            @RequestBody AssistantSalaryDetails entity) {
        return ResponseEntity.ok(service.update(new AssistantSalaryDetailsId(Receipt_id, Description), entity));
    }

    @DeleteMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        service.delete(new AssistantSalaryDetailsId(Receipt_id, Description));
        return ResponseEntity.noContent().build();
    }
}
