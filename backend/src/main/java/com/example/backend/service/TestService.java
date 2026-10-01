package com.example.backend.service;

import com.example.backend.entity.Test;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TestRepository;
import com.example.backend.entity.id.TestId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TestService {

    private final TestRepository repository;

    public TestService(TestRepository repository) {
        this.repository = repository;
    }

    public List<Test> getAll() {
        return repository.findAll();
    }

    public Test getById(TestId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found"));
    }

    public Test create(Test entity) {
        return repository.save(entity);
    }

    @Transactional
    public Test update(TestId id, Test entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Test not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TestId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Test not found");
        }
        repository.deleteById(id);
    }
}
