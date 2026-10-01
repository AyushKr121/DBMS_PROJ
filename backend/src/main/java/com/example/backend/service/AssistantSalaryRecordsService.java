package com.example.backend.service;

import com.example.backend.entity.AssistantSalaryRecords;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantSalaryRecordsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantSalaryRecordsService {

    private final AssistantSalaryRecordsRepository repository;

    public AssistantSalaryRecordsService(AssistantSalaryRecordsRepository repository) {
        this.repository = repository;
    }

    public List<AssistantSalaryRecords> getAll() {
        return repository.findAll();
    }

    public AssistantSalaryRecords getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Salary_Records not found"));
    }

    public AssistantSalaryRecords create(AssistantSalaryRecords entity) {
        return repository.save(entity);
    }

    public AssistantSalaryRecords update(Integer id, AssistantSalaryRecords entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Salary_Records not found");
        }
        entity.setReceipt_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Salary_Records not found");
        }
        repository.deleteById(id);
    }
}
