package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Domain        : Communications
 * Entities      : Batch_Notification, Global_Notification
 * Base route    : /api/notifications
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/notifications/batches                  createBatchNotification
 * GET     /api/notifications/batches/{batch_id}        getBatchNotifications
 * POST    /api/notifications/global                    createGlobalNotification
 * GET     /api/notifications/global                    getGlobalNotifications
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ------------------------------------------------------- Batch_Notification --

    @PostMapping("/batches")
    public ResponseEntity<Object> createBatchNotification(@RequestBody BatchNotificationRequest request) {
        Object created = notificationService.createBatchNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/batches/{batch_id}")
    public ResponseEntity<List<Object>> getBatchNotifications(@PathVariable("batch_id") Long batchId) {
        return ResponseEntity.ok(notificationService.getBatchNotifications(batchId));
    }

    // ------------------------------------------------------ Global_Notification --

    @PostMapping("/global")
    public ResponseEntity<Object> createGlobalNotification(@RequestBody GlobalNotificationRequest request) {
        Object created = notificationService.createGlobalNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/global")
    public ResponseEntity<List<Object>> getGlobalNotifications() {
        return ResponseEntity.ok(notificationService.getGlobalNotifications());
    }

    // ---------------------------------------------------------------- DTOs -------

    public record BatchNotificationRequest(Long batchId, String title, String description) {}

    public record GlobalNotificationRequest(Long assistantId, LocalDate notificationDate,
                                             LocalTime notificationTime, String notificationTitle,
                                             String description) {}
}

/**
 * Service contract for {@link NotificationController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface NotificationService {

    Object createBatchNotification(NotificationController.BatchNotificationRequest request);

    List<Object> getBatchNotifications(Long batchId);

    Object createGlobalNotification(NotificationController.GlobalNotificationRequest request);

    List<Object> getGlobalNotifications();
}
