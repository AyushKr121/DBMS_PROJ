package com.example.backend.service;

import com.example.backend.entity.Admin;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public List<Admin> getAll() {
        return repository.findAll();
    }

    public Admin getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    public Admin create(Admin entity) {
        return repository.save(entity);
    }

    public Admin update(Integer id, Admin entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found");
        }
        entity.setAdmin_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found");
        }
        repository.deleteById(id);
    }
}
