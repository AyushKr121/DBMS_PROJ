package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Domain        : Operations
 * Entities      : Student_Attendance, Teacher_Attendance
 * Base route    : /api/attendance
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/attendance/students                    markStudentAttendance
 * GET     /api/attendance/students/{student_id}        getStudentAttendance
 * PUT     /api/attendance/students                     updateStudentAttendance
 * POST    /api/attendance/teachers                     markTeacherAttendance
 * GET     /api/attendance/teachers/{teacher_id}         getTeacherAttendance
 * PUT     /api/attendance/teachers                      updateTeacherAttendance
 * --------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // -------------------------------------------------------- Student_Attendance --

    @PostMapping("/students")
    public ResponseEntity<Object> markStudentAttendance(@RequestBody StudentAttendanceRequest request) {
        Object created = attendanceService.markStudentAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/students/{student_id}")
    public ResponseEntity<List<Object>> getStudentAttendance(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }

    @PutMapping("/students")
    public ResponseEntity<Object> updateStudentAttendance(@RequestBody StudentAttendanceRequest request) {
        return attendanceService.updateStudentAttendance(request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------- Teacher_Attendance --

    @PostMapping("/teachers")
    public ResponseEntity<Object> markTeacherAttendance(@RequestBody TeacherAttendanceRequest request) {
        Object created = attendanceService.markTeacherAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/teachers/{teacher_id}")
    public ResponseEntity<List<Object>> getTeacherAttendance(@PathVariable("teacher_id") Long teacherId) {
        return ResponseEntity.ok(attendanceService.getTeacherAttendance(teacherId));
    }

    @PutMapping("/teachers")
    public ResponseEntity<Object> updateTeacherAttendance(@RequestBody TeacherAttendanceRequest request) {
        return attendanceService.updateTeacherAttendance(request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- DTOs -------

    public record StudentAttendanceRequest(LocalDate date, Long studentId, Long batchId, String status) {}

    public record TeacherAttendanceRequest(LocalDate date, Long teacherId, String status) {}
}

/**
 * Service contract for {@link AttendanceController}.
 * Implement this as a @Service backed by your JPA repositories.
 * Student_Attendance key: (Date, Student_id, Batch_id). Teacher_Attendance_Record key: (Date, Teacher_id).
 */
interface AttendanceService {

    Object markStudentAttendance(AttendanceController.StudentAttendanceRequest request);

    List<Object> getStudentAttendance(Long studentId);

    java.util.Optional<Object> updateStudentAttendance(AttendanceController.StudentAttendanceRequest request);

    Object markTeacherAttendance(AttendanceController.TeacherAttendanceRequest request);

    List<Object> getTeacherAttendance(Long teacherId);

    java.util.Optional<Object> updateTeacherAttendance(AttendanceController.TeacherAttendanceRequest request);
}
