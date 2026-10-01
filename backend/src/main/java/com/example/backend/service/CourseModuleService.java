package com.example.backend.service;

import com.example.backend.entity.CourseModule;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CourseModuleRepository;
import com.example.backend.entity.id.CourseModuleId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseModuleService {

    private final CourseModuleRepository repository;

    public CourseModuleService(CourseModuleRepository repository) {
        this.repository = repository;
    }

    public List<CourseModule> getAll() {
        return repository.findAll();
    }

    public CourseModule getById(CourseModuleId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course_Module not found"));
    }

    public CourseModule create(CourseModule entity) {
        return repository.save(entity);
    }

    @Transactional
    public CourseModule update(CourseModuleId id, CourseModule entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Course_Module not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(CourseModuleId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Course_Module not found");
        }
        repository.deleteById(id);
    }
}
