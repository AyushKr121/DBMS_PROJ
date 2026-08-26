package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Domain        : Academics
 * Entities      : Course, Course_Module
 * Base route    : /api/courses, /api/modules
 *
 * Route table (from database_api_routes.csv)
 * --------------------------------------------------------------------------------
 * POST    /api/courses                             createCourse
 * GET     /api/courses                             getAllCourses
 * GET     /api/courses/{course_id}                 getCourseById
 * PUT     /api/courses/{course_id}                 updateCourse
 * DELETE  /api/courses/{course_id}                 deleteCourse
 * POST    /api/courses/{course_id}/modules          addCourseModule
 * GET     /api/courses/{course_id}/modules          getCourseModules
 * PUT     /api/modules/{module_id}                 updateCourseModule
 * DELETE  /api/modules/{module_id}                 deleteCourseModule
 * --------------------------------------------------------------------------------
 */
@RestController
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ----------------------------------------------------------------- Course ----

    @PostMapping("/api/courses")
    public ResponseEntity<Object> createCourse(@RequestBody CourseRequest request) {
        Object created = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/courses")
    public ResponseEntity<List<Object>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/api/courses/{course_id}")
    public ResponseEntity<Object> getCourseById(@PathVariable("course_id") Long courseId) {
        return courseService.getCourseById(courseId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/api/courses/{course_id}")
    public ResponseEntity<Object> updateCourse(@PathVariable("course_id") Long courseId,
                                                @RequestBody CourseRequest request) {
        return courseService.updateCourse(courseId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/courses/{course_id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable("course_id") Long courseId) {
        boolean deleted = courseService.deleteCourse(courseId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------- Course_Module ----

    @PostMapping("/api/courses/{course_id}/modules")
    public ResponseEntity<Object> addCourseModule(@PathVariable("course_id") Long courseId,
                                                    @RequestBody CourseModuleRequest request) {
        Object module = courseService.addCourseModule(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(module);
    }

    @GetMapping("/api/courses/{course_id}/modules")
    public ResponseEntity<List<Object>> getCourseModules(@PathVariable("course_id") Long courseId) {
        return ResponseEntity.ok(courseService.getCourseModules(courseId));
    }

    @PutMapping("/api/modules/{module_id}")
    public ResponseEntity<Object> updateCourseModule(@PathVariable("module_id") Long moduleId,
                                                       @RequestBody CourseModuleRequest request) {
        return courseService.updateCourseModule(moduleId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/modules/{module_id}")
    public ResponseEntity<Void> deleteCourseModule(@PathVariable("module_id") Long moduleId) {
        boolean deleted = courseService.deleteCourseModule(moduleId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------------- DTOs -------

    public record CourseRequest(
            String courseName,
            String description,
            Double price,
            Integer noOfModules,
            Integer noOfWeeks,
            String material,
            String category
    ) {}

    public record CourseModuleRequest(String moduleTitle, String moduleDescription) {}
}

/**
 * Service contract for {@link CourseController}.
 * Implement this as a @Service backed by your JPA repositories.
 */
interface CourseService {

    Object createCourse(CourseController.CourseRequest request);

    List<Object> getAllCourses();

    java.util.Optional<Object> getCourseById(Long courseId);

    java.util.Optional<Object> updateCourse(Long courseId, CourseController.CourseRequest request);

    boolean deleteCourse(Long courseId);

    Object addCourseModule(Long courseId, CourseController.CourseModuleRequest request);

    List<Object> getCourseModules(Long courseId);

    java.util.Optional<Object> updateCourseModule(Long moduleId, CourseController.CourseModuleRequest request);

    boolean deleteCourseModule(Long moduleId);
}
