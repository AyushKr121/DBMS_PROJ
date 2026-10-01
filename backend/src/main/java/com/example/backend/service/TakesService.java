package com.example.backend.service;

import com.example.backend.entity.Takes;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TakesRepository;
import com.example.backend.entity.id.TakesId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TakesService {

    private final TakesRepository repository;

    public TakesService(TakesRepository repository) {
        this.repository = repository;
    }

    public List<Takes> getAll() {
        return repository.findAll();
    }

    public Takes getById(TakesId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Takes not found"));
    }

    public Takes create(Takes entity) {
        return repository.save(entity);
    }

    @Transactional
    public Takes update(TakesId id, Takes entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Takes not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TakesId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Takes not found");
        }
        repository.deleteById(id);
    }
}
