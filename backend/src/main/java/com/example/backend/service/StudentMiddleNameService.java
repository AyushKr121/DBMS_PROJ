package com.example.backend.service;

import com.example.backend.entity.StudentMiddleName;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentMiddleNameRepository;
import com.example.backend.entity.id.StudentMiddleNameId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentMiddleNameService {

    private final StudentMiddleNameRepository repository;

    public StudentMiddleNameService(StudentMiddleNameRepository repository) {
        this.repository = repository;
    }

    public List<StudentMiddleName> getAll() {
        return repository.findAll();
    }

    public StudentMiddleName getById(StudentMiddleNameId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student_Middle_Name not found"));
    }

    public StudentMiddleName create(StudentMiddleName entity) {
        return repository.save(entity);
    }

    @Transactional
    public StudentMiddleName update(StudentMiddleNameId id, StudentMiddleName entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Middle_Name not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(StudentMiddleNameId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Middle_Name not found");
        }
        repository.deleteById(id);
    }
}
