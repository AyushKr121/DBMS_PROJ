package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Domain        : Finance
 * Entities      : Fee_Payment, Fee_Details
 * Base route    : /api/finance/fees
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/finance/fees                          recordFeePayment
 * GET     /api/finance/fees                          getAllFeePayments
 * GET     /api/finance/fees/{receipt_id}             getFeePaymentById
 * POST    /api/finance/fees/{receipt_id}/details      addFeeDetails
 * GET     /api/finance/fees/{receipt_id}/details      getFeeDetails
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/finance/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    // -------------------------------------------------------------- Fee_Payment --

    @PostMapping
    public ResponseEntity<Object> recordFeePayment(@RequestBody FeePaymentRequest request) {
        Object created = feeService.recordFeePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllFeePayments() {
        return ResponseEntity.ok(feeService.getAllFeePayments());
    }

    @GetMapping("/{receipt_id}")
    public ResponseEntity<Object> getFeePaymentById(@PathVariable("receipt_id") Long receiptId) {
        return feeService.getFeePaymentById(receiptId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------- Fee_Details --

    @PostMapping("/{receipt_id}/details")
    public ResponseEntity<Object> addFeeDetails(@PathVariable("receipt_id") Long receiptId,
                                                 @RequestBody FeeDetailsRequest request) {
        Object details = feeService.addFeeDetails(receiptId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(details);
    }

    @GetMapping("/{receipt_id}/details")
    public ResponseEntity<List<Object>> getFeeDetails(@PathVariable("receipt_id") Long receiptId) {
        return ResponseEntity.ok(feeService.getFeeDetails(receiptId));
    }

    // ---------------------------------------------------------------- DTOs -------

    public record FeePaymentRequest(Long studentId, Long batchId, Double amount, LocalDate paymentDate,
                                     LocalTime paymentTime, String modeOfPayment) {}

    public record FeeDetailsRequest(String description) {}
}

/**
 * Service contract for {@link FeeController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface FeeService {

    Object recordFeePayment(FeeController.FeePaymentRequest request);

    List<Object> getAllFeePayments();

    java.util.Optional<Object> getFeePaymentById(Long receiptId);

    Object addFeeDetails(Long receiptId, FeeController.FeeDetailsRequest request);

    List<Object> getFeeDetails(Long receiptId);
}
