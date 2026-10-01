package com.example.backend.service;

import com.example.backend.entity.Course;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public List<Course> getAll() {
        return repository.findAll();
    }

    public Course getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    public Course create(Course entity) {
        return repository.save(entity);
    }

    public Course update(Integer id, Course entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found");
        }
        entity.setCourse_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found");
        }
        repository.deleteById(id);
    }
}
