package com.example.backend.service;

import com.example.backend.entity.Assistant;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantService {

    private final AssistantRepository repository;

    public AssistantService(AssistantRepository repository) {
        this.repository = repository;
    }

    public List<Assistant> getAll() {
        return repository.findAll();
    }

    public Assistant getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant not found"));
    }

    public Assistant create(Assistant entity) {
        return repository.save(entity);
    }

    public Assistant update(Integer id, Assistant entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant not found");
        }
        entity.setAssistant_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant not found");
        }
        repository.deleteById(id);
    }
}
