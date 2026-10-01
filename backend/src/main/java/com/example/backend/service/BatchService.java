package com.example.backend.service;

import com.example.backend.entity.Batch;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchService {

    private final BatchRepository repository;

    public BatchService(BatchRepository repository) {
        this.repository = repository;
    }

    public List<Batch> getAll() {
        return repository.findAll();
    }

    public Batch getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
    }

    public Batch create(Batch entity) {
        return repository.save(entity);
    }

    public Batch update(Integer id, Batch entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Batch not found");
        }
        entity.setBatch_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Batch not found");
        }
        repository.deleteById(id);
    }
}
