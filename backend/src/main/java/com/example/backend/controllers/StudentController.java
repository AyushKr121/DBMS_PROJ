package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Student Management
 * Entities      : Student, Student_Contacts, Student_Middle_Name
 * Base route    : /api/students
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/students                                    createStudent
 * GET     /api/students                                    getAllStudents
 * GET     /api/students/{student_id}                       getStudentById
 * PUT     /api/students/{student_id}                       updateStudent
 * DELETE  /api/students/{student_id}                       deleteStudent
 * POST    /api/students/{student_id}/contacts               addStudentContact
 * GET     /api/students/{student_id}/contacts               getStudentContacts
 * DELETE  /api/students/{student_id}/contacts/{phone_no}    deleteStudentContact
 * POST    /api/students/{student_id}/middle-names            addStudentMiddleName
 * GET     /api/students/{student_id}/middle-names            getStudentMiddleNames
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ---------------------------------------------------------------- Student ----

    @PostMapping
    public ResponseEntity<Object> createStudent(@RequestBody StudentRequest request) {
        Object created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Object>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{student_id}")
    public ResponseEntity<Object> getStudentById(@PathVariable("student_id") Long studentId) {
        return studentService.getStudentById(studentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{student_id}")
    public ResponseEntity<Object> updateStudent(@PathVariable("student_id") Long studentId,
                                                 @RequestBody StudentRequest request) {
        return studentService.updateStudent(studentId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{student_id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("student_id") Long studentId) {
        boolean deleted = studentService.deleteStudent(studentId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------- Student_Contacts ----

    @PostMapping("/{student_id}/contacts")
    public ResponseEntity<Object> addStudentContact(@PathVariable("student_id") Long studentId,
                                                      @RequestBody ContactRequest request) {
        Object contact = studentService.addStudentContact(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    @GetMapping("/{student_id}/contacts")
    public ResponseEntity<List<Object>> getStudentContacts(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.ok(studentService.getStudentContacts(studentId));
    }

    @DeleteMapping("/{student_id}/contacts/{phone_no}")
    public ResponseEntity<Void> deleteStudentContact(@PathVariable("student_id") Long studentId,
                                                       @PathVariable("phone_no") String phoneNo) {
        boolean deleted = studentService.deleteStudentContact(studentId, phoneNo);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ----------------------------------------------------- Student_Middle_Name ----

    @PostMapping("/{student_id}/middle-names")
    public ResponseEntity<Object> addStudentMiddleName(@PathVariable("student_id") Long studentId,
                                                         @RequestBody MiddleNameRequest request) {
        Object middleName = studentService.addStudentMiddleName(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(middleName);
    }

    @GetMapping("/{student_id}/middle-names")
    public ResponseEntity<List<Object>> getStudentMiddleNames(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.ok(studentService.getStudentMiddleNames(studentId));
    }

    // ---------------------------------------------------------------- DTOs -------

    public record StudentRequest(
            String firstName,
            String lastName,
            String sex,
            LocalDate dob,
            String credential,
            Integer age,
            String email,
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
 * Service contract for {@link StudentController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface StudentService {

    Object createStudent(StudentController.StudentRequest request);

    List<Object> getAllStudents();

    java.util.Optional<Object> getStudentById(Long studentId);

    java.util.Optional<Object> updateStudent(Long studentId, StudentController.StudentRequest request);

    boolean deleteStudent(Long studentId);

    Object addStudentContact(Long studentId, StudentController.ContactRequest request);

    List<Object> getStudentContacts(Long studentId);

    boolean deleteStudentContact(Long studentId, String phoneNo);

    Object addStudentMiddleName(Long studentId, StudentController.MiddleNameRequest request);

    List<Object> getStudentMiddleNames(Long studentId);
}
