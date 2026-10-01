package com.example.backend.service;

import com.example.backend.entity.Pincode;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PincodeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PincodeService {

    private final PincodeRepository repository;

    public PincodeService(PincodeRepository repository) {
        this.repository = repository;
    }

    public List<Pincode> getAll() {
        return repository.findAll();
    }

    public Pincode getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pincode not found"));
    }

    public Pincode create(Pincode entity) {
        return repository.save(entity);
    }

    public Pincode update(String id, Pincode entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Pincode not found");
        }
        entity.setPincode(id);
        return repository.save(entity);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Pincode not found");
        }
        repository.deleteById(id);
    }
}
