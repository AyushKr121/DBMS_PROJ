package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Finance
 * Entities      : Teacher_Salary_Records, Teacher_Salary_Details,
 *                 Assistant_Salary_Records, Assistant_Salary_Details
 * Base route    : /api/finance/salaries
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/finance/salaries/teachers                              recordTeacherSalary
 * GET     /api/finance/salaries/teachers                              getAllTeacherSalaries
 * POST    /api/finance/salaries/teachers/{receipt_id}/details          addTeacherSalaryDetails
 * POST    /api/finance/salaries/assistants                            recordAssistantSalary
 * GET     /api/finance/salaries/assistants                            getAllAssistantSalaries
 * POST    /api/finance/salaries/assistants/{receipt_id}/details        addAssistantSalaryDetails
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/finance/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    // ------------------------------------------------- Teacher_Salary_Records/Details --

    @PostMapping("/teachers")
    public ResponseEntity<Object> recordTeacherSalary(@RequestBody TeacherSalaryRequest request) {
        Object created = salaryService.recordTeacherSalary(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<Object>> getAllTeacherSalaries() {
        return ResponseEntity.ok(salaryService.getAllTeacherSalaries());
    }

    @PostMapping("/teachers/{receipt_id}/details")
    public ResponseEntity<Object> addTeacherSalaryDetails(@PathVariable("receipt_id") Long receiptId,
                                                           @RequestBody SalaryDetailsRequest request) {
        Object details = salaryService.addTeacherSalaryDetails(receiptId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(details);
    }

    // ----------------------------------------------- Assistant_Salary_Records/Details --

    @PostMapping("/assistants")
    public ResponseEntity<Object> recordAssistantSalary(@RequestBody AssistantSalaryRequest request) {
        Object created = salaryService.recordAssistantSalary(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/assistants")
    public ResponseEntity<List<Object>> getAllAssistantSalaries() {
        return ResponseEntity.ok(salaryService.getAllAssistantSalaries());
    }

    @PostMapping("/assistants/{receipt_id}/details")
    public ResponseEntity<Object> addAssistantSalaryDetails(@PathVariable("receipt_id") Long receiptId,
                                                             @RequestBody SalaryDetailsRequest request) {
        Object details = salaryService.addAssistantSalaryDetails(receiptId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(details);
    }

    // ---------------------------------------------------------------- DTOs -------

    public record TeacherSalaryRequest(Long teacherId, Double amount, LocalDate salaryPaymentDate,
                                        String month, Integer year) {}

    public record AssistantSalaryRequest(Long assistantId, Double amount, LocalDate salaryPaymentDate,
                                          String month, Integer year) {}

    public record SalaryDetailsRequest(String description) {}
}

/**
 * Service contract for {@link SalaryController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface SalaryService {

    Object recordTeacherSalary(SalaryController.TeacherSalaryRequest request);

    List<Object> getAllTeacherSalaries();

    Object addTeacherSalaryDetails(Long receiptId, SalaryController.SalaryDetailsRequest request);

    Object recordAssistantSalary(SalaryController.AssistantSalaryRequest request);

    List<Object> getAllAssistantSalaries();

    Object addAssistantSalaryDetails(Long receiptId, SalaryController.SalaryDetailsRequest request);
}
