package com.example.backend.service;

import com.example.backend.entity.Student;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Student getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    public Student create(Student entity) {
        return repository.save(entity);
    }

    public Student update(Integer id, Student entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        entity.setStudent_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        repository.deleteById(id);
    }
}
