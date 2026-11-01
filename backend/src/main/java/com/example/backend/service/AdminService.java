package com.example.backend.service;

import com.example.backend.entity.Admin;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder alongside your existing AdminRepository
    public AdminService(AdminRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Admin> getAll() {
        return repository.findAll();
    }

    public Admin getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    public Admin create(Admin entity) {
        // Hash the plain-text password before saving to the database
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        }
        return repository.save(entity);
    }

    public Admin update(Integer id, Admin entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found");
        }
        
        // Retrieve the existing admin to prevent overwriting the password with null if it isn't sent in the request
        Admin existingAdmin = repository.findById(id).get();
        
        entity.setAdmin_id(id);
        
        // Only hash and update the password if a new one is provided
        if (entity.getCredential() != null && !entity.getCredential().isEmpty()) {
            entity.setCredential(passwordEncoder.encode(entity.getCredential()));
        } else {
            entity.setCredential(existingAdmin.getCredential()); // Retain the old hash
        }
        
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found");
        }
        repository.deleteById(id);
    }
}