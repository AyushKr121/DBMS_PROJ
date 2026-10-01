package com.example.backend.service;

import com.example.backend.entity.AssistantSalaryDetails;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantSalaryDetailsRepository;
import com.example.backend.entity.id.AssistantSalaryDetailsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantSalaryDetailsService {

    private final AssistantSalaryDetailsRepository repository;

    public AssistantSalaryDetailsService(AssistantSalaryDetailsRepository repository) {
        this.repository = repository;
    }

    public List<AssistantSalaryDetails> getAll() {
        return repository.findAll();
    }

    public AssistantSalaryDetails getById(AssistantSalaryDetailsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Salary_Details not found"));
    }

    public AssistantSalaryDetails create(AssistantSalaryDetails entity) {
        return repository.save(entity);
    }

    @Transactional
    public AssistantSalaryDetails update(AssistantSalaryDetailsId id, AssistantSalaryDetails entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Salary_Details not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AssistantSalaryDetailsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Salary_Details not found");
        }
        repository.deleteById(id);
    }
}
