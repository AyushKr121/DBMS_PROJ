package com.example.backend.controller;

import com.example.backend.entity.FeeDetails;
import com.example.backend.service.FeeDetailsService;
import com.example.backend.entity.id.FeeDetailsId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-details")
@CrossOrigin(origins = "http://localhost:5173")
public class FeeDetailsController {

    private final FeeDetailsService service;

    public FeeDetailsController(FeeDetailsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FeeDetails>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<FeeDetails> getById(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        return ResponseEntity.ok(service.getById(new FeeDetailsId(Receipt_id, Description)));
    }

    @PostMapping
    public ResponseEntity<FeeDetails> create(@RequestBody FeeDetails entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<FeeDetails> update(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description,
            @RequestBody FeeDetails entity) {
        return ResponseEntity.ok(service.update(new FeeDetailsId(Receipt_id, Description), entity));
    }

    @DeleteMapping("/{Receipt_id}/{Description}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer Receipt_id,
            @PathVariable String Description) {
        service.delete(new FeeDetailsId(Receipt_id, Description));
        return ResponseEntity.noContent().build();
    }
}
