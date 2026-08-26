package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Admin Management
 * Entities      : Admin, Admin_Contacts, Admin_Middle_Name
 * Base route    : /api/admins
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/admins                                     createAdmin
 * GET     /api/admins                                     getAllAdmins
 * GET     /api/admins/{admin_id}                          getAdminById
 * PUT     /api/admins/{admin_id}                          updateAdmin
 * DELETE  /api/admins/{admin_id}                          deleteAdmin
 * POST    /api/admins/{admin_id}/contacts                  addAdminContact
 * GET     /api/admins/{admin_id}/contacts                  getAdminContacts
 * POST    /api/admins/{admin_id}/middle-names               addAdminMiddleName
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ------------------------------------------------------------------ Admin ----

    @PostMapping
    public ResponseEntity<Object> createAdmin(@RequestBody AdminRequest request) {
        Object created = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{admin_id}")
    public ResponseEntity<Object> getAdminById(@PathVariable("admin_id") Long adminId) {
        return adminService.getAdminById(adminId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{admin_id}")
    public ResponseEntity<Object> updateAdmin(@PathVariable("admin_id") Long adminId,
                                               @RequestBody AdminRequest request) {
        return adminService.updateAdmin(adminId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{admin_id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable("admin_id") Long adminId) {
        boolean deleted = adminService.deleteAdmin(adminId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------- Admin_Contacts ----

    @PostMapping("/{admin_id}/contacts")
    public ResponseEntity<Object> addAdminContact(@PathVariable("admin_id") Long adminId,
                                                   @RequestBody ContactRequest request) {
        Object contact = adminService.addAdminContact(adminId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    @GetMapping("/{admin_id}/contacts")
    public ResponseEntity<List<Object>> getAdminContacts(@PathVariable("admin_id") Long adminId) {
        return ResponseEntity.ok(adminService.getAdminContacts(adminId));
    }

    // ------------------------------------------------------- Admin_Middle_Name ----

    @PostMapping("/{admin_id}/middle-names")
    public ResponseEntity<Object> addAdminMiddleName(@PathVariable("admin_id") Long adminId,
                                                       @RequestBody MiddleNameRequest request) {
        Object middleName = adminService.addAdminMiddleName(adminId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(middleName);
    }

    // ---------------------------------------------------------------- DTOs -------

    public record AdminRequest(
            Integer age,
            String aadharId,
            LocalDate dob,
            String email,
            String credential,
            String sex,
            String firstName,
            String lastName,
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
 * Service contract for {@link AdminController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface AdminService {

    Object createAdmin(AdminController.AdminRequest request);

    List<Object> getAllAdmins();

    java.util.Optional<Object> getAdminById(Long adminId);

    java.util.Optional<Object> updateAdmin(Long adminId, AdminController.AdminRequest request);

    boolean deleteAdmin(Long adminId);

    Object addAdminContact(Long adminId, AdminController.ContactRequest request);

    List<Object> getAdminContacts(Long adminId);

    Object addAdminMiddleName(Long adminId, AdminController.MiddleNameRequest request);
}
