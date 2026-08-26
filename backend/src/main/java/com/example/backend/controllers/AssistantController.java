package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Assistant Management
 * Entities      : Assistant, Assistant_Contacts, Assistant_Middle_Name
 * Base route    : /api/assistants
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/assistants                                    createAssistant
 * GET     /api/assistants                                    getAllAssistants
 * GET     /api/assistants/{assistant_id}                     getAssistantById
 * PUT     /api/assistants/{assistant_id}                     updateAssistant
 * DELETE  /api/assistants/{assistant_id}                     deleteAssistant
 * POST    /api/assistants/{assistant_id}/contacts             addAssistantContact
 * GET     /api/assistants/{assistant_id}/contacts             getAssistantContacts
 * POST    /api/assistants/{assistant_id}/middle-names          addAssistantMiddleName
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/assistants")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    // -------------------------------------------------------------- Assistant ----

    @PostMapping
    public ResponseEntity<Object> createAssistant(@RequestBody AssistantRequest request) {
        Object created = assistantService.createAssistant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllAssistants() {
        return ResponseEntity.ok(assistantService.getAllAssistants());
    }

    @GetMapping("/{assistant_id}")
    public ResponseEntity<Object> getAssistantById(@PathVariable("assistant_id") Long assistantId) {
        return assistantService.getAssistantById(assistantId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{assistant_id}")
    public ResponseEntity<Object> updateAssistant(@PathVariable("assistant_id") Long assistantId,
                                                    @RequestBody AssistantRequest request) {
        return assistantService.updateAssistant(assistantId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{assistant_id}")
    public ResponseEntity<Void> deleteAssistant(@PathVariable("assistant_id") Long assistantId) {
        boolean deleted = assistantService.deleteAssistant(assistantId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ------------------------------------------------------ Assistant_Contacts ----

    @PostMapping("/{assistant_id}/contacts")
    public ResponseEntity<Object> addAssistantContact(@PathVariable("assistant_id") Long assistantId,
                                                        @RequestBody ContactRequest request) {
        Object contact = assistantService.addAssistantContact(assistantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    @GetMapping("/{assistant_id}/contacts")
    public ResponseEntity<List<Object>> getAssistantContacts(@PathVariable("assistant_id") Long assistantId) {
        return ResponseEntity.ok(assistantService.getAssistantContacts(assistantId));
    }

    // --------------------------------------------------- Assistant_Middle_Name ----

    @PostMapping("/{assistant_id}/middle-names")
    public ResponseEntity<Object> addAssistantMiddleName(@PathVariable("assistant_id") Long assistantId,
                                                           @RequestBody MiddleNameRequest request) {
        Object middleName = assistantService.addAssistantMiddleName(assistantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(middleName);
    }

    // ---------------------------------------------------------------- DTOs -------

    public record AssistantRequest(
            String firstName,
            String lastName,
            Integer age,
            String aadharId,
            LocalDate dob,
            String email,
            String credential,
            String sex,
            Double salary,
            String houseNo,
            String street,
            String city,
            String state,
            String pincode
    ) {}

    public record ContactRequest(String phoneNo) {}

    public record MiddleNameRequest(String middleName) {}
}

/**
 * Service contract for {@link AssistantController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface AssistantService {

    Object createAssistant(AssistantController.AssistantRequest request);

    List<Object> getAllAssistants();

    java.util.Optional<Object> getAssistantById(Long assistantId);

    java.util.Optional<Object> updateAssistant(Long assistantId, AssistantController.AssistantRequest request);

    boolean deleteAssistant(Long assistantId);

    Object addAssistantContact(Long assistantId, AssistantController.ContactRequest request);

    List<Object> getAssistantContacts(Long assistantId);

    Object addAssistantMiddleName(Long assistantId, AssistantController.MiddleNameRequest request);
}
