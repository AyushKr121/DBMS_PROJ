package com.example.backend.service;

import com.example.backend.entity.AssistantContacts;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantContactsRepository;
import com.example.backend.entity.id.AssistantContactsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantContactsService {

    private final AssistantContactsRepository repository;

    public AssistantContactsService(AssistantContactsRepository repository) {
        this.repository = repository;
    }

    public List<AssistantContacts> getAll() {
        return repository.findAll();
    }

    public AssistantContacts getById(AssistantContactsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Contacts not found"));
    }

    public AssistantContacts create(AssistantContacts entity) {
        return repository.save(entity);
    }

    @Transactional
    public AssistantContacts update(AssistantContactsId id, AssistantContacts entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Contacts not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AssistantContactsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Contacts not found");
        }
        repository.deleteById(id);
    }
}
