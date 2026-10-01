package com.example.backend.controller;

import com.example.backend.entity.Globalnotification;
import com.example.backend.service.GlobalnotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/globalnotification")
@CrossOrigin(origins = "http://localhost:5173")
public class GlobalnotificationController {

    private final GlobalnotificationService service;

    public GlobalnotificationController(GlobalnotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Globalnotification>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Notification_id}")
    public ResponseEntity<Globalnotification> getById(@PathVariable Integer Notification_id) {
        return ResponseEntity.ok(service.getById(Notification_id));
    }

    @PostMapping
    public ResponseEntity<Globalnotification> create(@RequestBody Globalnotification entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Notification_id}")
    public ResponseEntity<Globalnotification> update(
            @PathVariable Integer Notification_id,
            @RequestBody Globalnotification entity) {
        return ResponseEntity.ok(service.update(Notification_id, entity));
    }

    @DeleteMapping("/{Notification_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Notification_id) {
        service.delete(Notification_id);
        return ResponseEntity.noContent().build();
    }
}
