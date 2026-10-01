package com.example.backend.service;

import com.example.backend.entity.AdminContacts;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AdminContactsRepository;
import com.example.backend.entity.id.AdminContactsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminContactsService {

    private final AdminContactsRepository repository;

    public AdminContactsService(AdminContactsRepository repository) {
        this.repository = repository;
    }

    public List<AdminContacts> getAll() {
        return repository.findAll();
    }

    public AdminContacts getById(AdminContactsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin_Contacts not found"));
    }

    public AdminContacts create(AdminContacts entity) {
        return repository.save(entity);
    }

    @Transactional 
    public AdminContacts update(AdminContactsId id, AdminContacts entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin_Contacts not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AdminContactsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin_Contacts not found");
        }
        repository.deleteById(id);
    }
}
