package com.example.backend.service;

import com.example.backend.entity.FeeDetails;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.FeeDetailsRepository;
import com.example.backend.entity.id.FeeDetailsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeeDetailsService {

    private final FeeDetailsRepository repository;

    public FeeDetailsService(FeeDetailsRepository repository) {
        this.repository = repository;
    }

    public List<FeeDetails> getAll() {
        return repository.findAll();
    }

    public FeeDetails getById(FeeDetailsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee_Details not found"));
    }

    public FeeDetails create(FeeDetails entity) {
        return repository.save(entity);
    }

    @Transactional
    public FeeDetails update(FeeDetailsId id, FeeDetails entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Fee_Details not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(FeeDetailsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Fee_Details not found");
        }
        repository.deleteById(id);
    }
}
