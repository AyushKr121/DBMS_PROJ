package com.example.backend.controller;

import com.example.backend.entity.Pincode;
import com.example.backend.service.PincodeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pincode")
@CrossOrigin(origins = "http://localhost:5173")
public class PincodeController {

    private final PincodeService service;

    public PincodeController(PincodeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Pincode>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Pincode}")
    public ResponseEntity<Pincode> getById(@PathVariable String Pincode) {
        return ResponseEntity.ok(service.getById(Pincode));
    }

    @PostMapping
    public ResponseEntity<Pincode> create(@RequestBody Pincode entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Pincode}")
    public ResponseEntity<Pincode> update(
            @PathVariable String Pincode,
            @RequestBody Pincode entity) {
        return ResponseEntity.ok(service.update(Pincode, entity));
    }

    @DeleteMapping("/{Pincode}")
    public ResponseEntity<Void> delete(@PathVariable String Pincode) {
        service.delete(Pincode);
        return ResponseEntity.noContent().build();
    }
}
