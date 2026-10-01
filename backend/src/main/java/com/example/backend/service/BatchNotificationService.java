package com.example.backend.service;

import com.example.backend.entity.BatchNotification;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BatchNotificationRepository;
import com.example.backend.entity.id.BatchNotificationId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BatchNotificationService {

    private final BatchNotificationRepository repository;

    public BatchNotificationService(BatchNotificationRepository repository) {
        this.repository = repository;
    }

    public List<BatchNotification> getAll() {
        return repository.findAll();
    }

    public BatchNotification getById(BatchNotificationId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch_Notification not found"));
    }

    public BatchNotification create(BatchNotification entity) {
        return repository.save(entity);
    }

    @Transactional
    public BatchNotification update(BatchNotificationId id, BatchNotification entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Batch_Notification not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(BatchNotificationId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Batch_Notification not found");
        }
        repository.deleteById(id);
    }
}
