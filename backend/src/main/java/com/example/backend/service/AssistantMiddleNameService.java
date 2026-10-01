package com.example.backend.service;

import com.example.backend.entity.AssistantMiddleName;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantMiddleNameRepository;
import com.example.backend.entity.id.AssistantMiddleNameId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantMiddleNameService {

    private final AssistantMiddleNameRepository repository;

    public AssistantMiddleNameService(AssistantMiddleNameRepository repository) {
        this.repository = repository;
    }

    public List<AssistantMiddleName> getAll() {
        return repository.findAll();
    }

    public AssistantMiddleName getById(AssistantMiddleNameId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Middle_Name not found"));
    }

    public AssistantMiddleName create(AssistantMiddleName entity) {
        return repository.save(entity);
    }

    @Transactional
    public AssistantMiddleName update(AssistantMiddleNameId id, AssistantMiddleName entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Middle_Name not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AssistantMiddleNameId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Middle_Name not found");
        }
        repository.deleteById(id);
    }
}
