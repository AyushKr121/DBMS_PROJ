package com.example.backend.service;

import com.example.backend.entity.Teacher;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder alongside your existing TeacherRepository
    public TeacherService(TeacherRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Teacher> getAll() {
        return repository.findAll();
    }

    public Teacher getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    public Teacher create(Teacher entity) {
        // Hash the plain-text password before saving to the database
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        }
        return repository.save(entity);
    }

    public Teacher update(Integer id, Teacher entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found");
        }
        
        // Retrieve the existing teacher to prevent overwriting the password with null if it isn't sent in the request
        Teacher existingTeacher = repository.findById(id).get();
        
        entity.setTeacher_id(id);
        
        // Only hash and update the password if a new one is provided
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        } else {
            entity.setCredential(existingTeacher.getCredential()); // Retain the old hash
        }
        
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found");
        }
        repository.deleteById(id);
    }
}