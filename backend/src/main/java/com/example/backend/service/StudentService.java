package com.example.backend.service;

import com.example.backend.entity.Student;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder alongside your existing StudentRepository
    public StudentService(StudentRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Student getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    public Student create(Student entity) {
        // Hash the plain-text password before saving to the database
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        }
        return repository.save(entity);
    }

    public Student update(Integer id, Student entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        
        // Retrieve the existing student to prevent overwriting the password with null if it isn't sent in the request
        Student existingStudent = repository.findById(id).get();
        
        entity.setStudent_id(id);
        
        String credential = entity.getCredential();
        if (credential == null || credential.isEmpty() || credential.equals(existingStudent.getCredential())) {
            entity.setCredential(existingStudent.getCredential());
        } else {
            entity.setCredential(passwordEncoder.encode(credential));
        }
        
        return repository.save(entity);
    }

    @Transactional
    public void updateLastSeenNotification(Integer id, Integer notificationId) {
        if (repository.updateLastSeenNotification(id, notificationId) == 0) {
            throw new ResourceNotFoundException("Student not found");
        }
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        repository.deleteById(id);
    }
}