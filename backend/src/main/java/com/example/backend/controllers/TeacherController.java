package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Teacher Management
 * Entities      : Teacher, Teacher_Contacts, Teacher_Middle_Name
 * Base route    : /api/teachers
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/teachers                                   createTeacher
 * GET     /api/teachers                                   getAllTeachers
 * GET     /api/teachers/{teacher_id}                      getTeacherById
 * PUT     /api/teachers/{teacher_id}                      updateTeacher
 * DELETE  /api/teachers/{teacher_id}                      deleteTeacher
 * POST    /api/teachers/{teacher_id}/contacts              addTeacherContact
 * GET     /api/teachers/{teacher_id}/contacts              getTeacherContacts
 * POST    /api/teachers/{teacher_id}/middle-names           addTeacherMiddleName
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    // ---------------------------------------------------------------- Teacher ----

    @PostMapping
    public ResponseEntity<Object> createTeacher(@RequestBody TeacherRequest request) {
        Object created = teacherService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{teacher_id}")
    public ResponseEntity<Object> getTeacherById(@PathVariable("teacher_id") Long teacherId) {
        return teacherService.getTeacherById(teacherId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{teacher_id}")
    public ResponseEntity<Object> updateTeacher(@PathVariable("teacher_id") Long teacherId,
                                                 @RequestBody TeacherRequest request) {
        return teacherService.updateTeacher(teacherId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{teacher_id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable("teacher_id") Long teacherId) {
        boolean deleted = teacherService.deleteTeacher(teacherId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------- Teacher_Contacts ----

    @PostMapping("/{teacher_id}/contacts")
    public ResponseEntity<Object> addTeacherContact(@PathVariable("teacher_id") Long teacherId,
                                                      @RequestBody ContactRequest request) {
        Object contact = teacherService.addTeacherContact(teacherId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    @GetMapping("/{teacher_id}/contacts")
    public ResponseEntity<List<Object>> getTeacherContacts(@PathVariable("teacher_id") Long teacherId) {
        return ResponseEntity.ok(teacherService.getTeacherContacts(teacherId));
    }

    // ----------------------------------------------------- Teacher_Middle_Name ----

    @PostMapping("/{teacher_id}/middle-names")
    public ResponseEntity<Object> addTeacherMiddleName(@PathVariable("teacher_id") Long teacherId,
                                                         @RequestBody MiddleNameRequest request) {
        Object middleName = teacherService.addTeacherMiddleName(teacherId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(middleName);
    }

    // ---------------------------------------------------------------- DTOs -------

    public record TeacherRequest(
            String firstName,
            String lastName,
            LocalDate dob,
            Integer age,
            String sex,
            String email,
            String credential,
            Double salary,
            LocalDate joiningDate,
            String houseNo,
            String street,
            String city,
            String state,
            String pincode,
            String aadharId
    ) {}

    public record ContactRequest(String phoneNo) {}

    public record MiddleNameRequest(String middleName) {}
}

/**
 * Service contract for {@link TeacherController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface TeacherService {

    Object createTeacher(TeacherController.TeacherRequest request);

    List<Object> getAllTeachers();

    java.util.Optional<Object> getTeacherById(Long teacherId);

    java.util.Optional<Object> updateTeacher(Long teacherId, TeacherController.TeacherRequest request);

    boolean deleteTeacher(Long teacherId);

    Object addTeacherContact(Long teacherId, TeacherController.ContactRequest request);

    List<Object> getTeacherContacts(Long teacherId);

    Object addTeacherMiddleName(Long teacherId, TeacherController.MiddleNameRequest request);
}
