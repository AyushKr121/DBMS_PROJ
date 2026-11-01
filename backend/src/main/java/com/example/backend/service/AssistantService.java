package com.example.backend.service;

import com.example.backend.entity.Assistant;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantService {

    private final AssistantRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder alongside your existing AssistantRepository
    public AssistantService(AssistantRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Assistant> getAll() {
        return repository.findAll();
    }

    public Assistant getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant not found"));
    }

    public Assistant create(Assistant entity) {
        // Hash the plain-text password before saving to the database
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        }
        return repository.save(entity);
    }

    public Assistant update(Integer id, Assistant entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant not found");
        }
        
        // Retrieve the existing assistant to prevent overwriting the password with null if it isn't sent in the request
        Assistant existingAssistant = repository.findById(id).get();
        
        entity.setAssistant_id(id);
        
        // Only hash and update the password if a new one is provided
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        } else {
            entity.setCredential(existingAssistant.getCredential()); // Retain the old hash
        }
        
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant not found");
        }
        repository.deleteById(id);
    }
}