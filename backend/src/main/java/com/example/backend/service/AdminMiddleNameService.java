package com.example.backend.service;

import com.example.backend.entity.AdminMiddleName;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AdminMiddleNameRepository;
import com.example.backend.entity.id.AdminMiddleNameId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminMiddleNameService {

    private final AdminMiddleNameRepository repository;

    public AdminMiddleNameService(AdminMiddleNameRepository repository) {
        this.repository = repository;
    }

    public List<AdminMiddleName> getAll() {
        return repository.findAll();
    }

    public AdminMiddleName getById(AdminMiddleNameId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin_Middle_Name not found"));
    }

    public AdminMiddleName create(AdminMiddleName entity) {
        return repository.save(entity);
    }

    @Transactional
    public AdminMiddleName update(AdminMiddleNameId id, AdminMiddleName entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin_Middle_Name not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AdminMiddleNameId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin_Middle_Name not found");
        }
        repository.deleteById(id);
    }
}
