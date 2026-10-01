package com.example.backend.service;

import com.example.backend.entity.Globalnotification;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.GlobalnotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GlobalnotificationService {

    private final GlobalnotificationRepository repository;

    public GlobalnotificationService(GlobalnotificationRepository repository) {
        this.repository = repository;
    }

    public List<Globalnotification> getAll() {
        return repository.findAll();
    }

    public Globalnotification getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalNotification not found"));
    }

    public Globalnotification create(Globalnotification entity) {
        return repository.save(entity);
    }

    public Globalnotification update(Integer id, Globalnotification entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("GlobalNotification not found");
        }
        entity.setNotification_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("GlobalNotification not found");
        }
        repository.deleteById(id);
    }
}
