package com.example.backend.controller;

import com.example.backend.entity.AssistantLastseenNotification;
import com.example.backend.service.AssistantLastseenNotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant-lastseen-notification")
@CrossOrigin(origins = "http://localhost:5173")
public class AssistantLastseenNotificationController {

    private final AssistantLastseenNotificationService service;

    public AssistantLastseenNotificationController(AssistantLastseenNotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AssistantLastseenNotification>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{Assistant_id}")
    public ResponseEntity<AssistantLastseenNotification> getById(@PathVariable Integer Assistant_id) {
        return ResponseEntity.ok(service.getById(Assistant_id));
    }

    @PostMapping
    public ResponseEntity<AssistantLastseenNotification> create(@RequestBody AssistantLastseenNotification entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @PutMapping("/{Assistant_id}")
    public ResponseEntity<AssistantLastseenNotification> update(
            @PathVariable Integer Assistant_id,
            @RequestBody AssistantLastseenNotification entity) {
        return ResponseEntity.ok(service.update(Assistant_id, entity));
    }

    @DeleteMapping("/{Assistant_id}")
    public ResponseEntity<Void> delete(@PathVariable Integer Assistant_id) {
        service.delete(Assistant_id);
        return ResponseEntity.noContent().build();
    }
}
