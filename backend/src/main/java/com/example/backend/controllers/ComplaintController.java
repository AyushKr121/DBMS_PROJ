package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Domain        : Operations
 * Entities      : Student_Complaints, Teacher_Complaints, Assistant_Complaints
 * Base route    : /api/complaints
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/complaints/students        createStudentComplaint
 * GET     /api/complaints/students        getAllStudentComplaints
 * POST    /api/complaints/teachers        createTeacherComplaint
 * GET     /api/complaints/teachers        getAllTeacherComplaints
 * POST    /api/complaints/assistants      createAssistantComplaint
 * GET     /api/complaints/assistants      getAllAssistantComplaints
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // -------------------------------------------------------- Student_Complaints --

    @PostMapping("/students")
    public ResponseEntity<Object> createStudentComplaint(@RequestBody StudentComplaintRequest request) {
        Object created = complaintService.createStudentComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Object>> getAllStudentComplaints() {
        return ResponseEntity.ok(complaintService.getAllStudentComplaints());
    }

    // -------------------------------------------------------- Teacher_Complaints --

    @PostMapping("/teachers")
    public ResponseEntity<Object> createTeacherComplaint(@RequestBody TeacherComplaintRequest request) {
        Object created = complaintService.createTeacherComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<Object>> getAllTeacherComplaints() {
        return ResponseEntity.ok(complaintService.getAllTeacherComplaints());
    }

    // ------------------------------------------------------ Assistant_Complaints --

    @PostMapping("/assistants")
    public ResponseEntity<Object> createAssistantComplaint(@RequestBody AssistantComplaintRequest request) {
        Object created = complaintService.createAssistantComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/assistants")
    public ResponseEntity<List<Object>> getAllAssistantComplaints() {
        return ResponseEntity.ok(complaintService.getAllAssistantComplaints());
    }

    // ---------------------------------------------------------------- DTOs -------

    public record StudentComplaintRequest(Long studentId, String title, LocalDate complaintDate,
                                           LocalTime complaintTime, String complaintDescription) {}

    public record TeacherComplaintRequest(Long teacherId, String title, LocalDate complaintDate,
                                           LocalTime complaintTime, String complaintDescription) {}

    public record AssistantComplaintRequest(Long assistantId, String complaintDescription,
                                             LocalDate complaintDate, LocalTime complaintTime) {}
}

/**
 * Service contract for {@link ComplaintController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface ComplaintService {

    Object createStudentComplaint(ComplaintController.StudentComplaintRequest request);

    List<Object> getAllStudentComplaints();

    Object createTeacherComplaint(ComplaintController.TeacherComplaintRequest request);

    List<Object> getAllTeacherComplaints();

    Object createAssistantComplaint(ComplaintController.AssistantComplaintRequest request);

    List<Object> getAllAssistantComplaints();
}
