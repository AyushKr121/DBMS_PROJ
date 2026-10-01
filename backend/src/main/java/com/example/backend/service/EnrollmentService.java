package com.example.backend.service;

import com.example.backend.entity.Enrollment;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.EnrollmentRepository;
import com.example.backend.entity.id.EnrollmentId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository repository;

    public EnrollmentService(EnrollmentRepository repository) {
        this.repository = repository;
    }

    public List<Enrollment> getAll() {
        return repository.findAll();
    }

    public Enrollment getById(EnrollmentId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
    }

    public Enrollment create(Enrollment entity) {
        return repository.save(entity);
    }

    @Transactional
    public Enrollment update(EnrollmentId id, Enrollment entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(EnrollmentId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found");
        }
        repository.deleteById(id);
    }
}
