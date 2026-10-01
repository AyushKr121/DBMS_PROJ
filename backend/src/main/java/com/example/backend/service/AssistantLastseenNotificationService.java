package com.example.backend.service;

import com.example.backend.entity.AssistantLastseenNotification;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantLastseenNotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantLastseenNotificationService {

    private final AssistantLastseenNotificationRepository repository;

    public AssistantLastseenNotificationService(AssistantLastseenNotificationRepository repository) {
        this.repository = repository;
    }

    public List<AssistantLastseenNotification> getAll() {
        return repository.findAll();
    }

    public AssistantLastseenNotification getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_LastSeen_Notification not found"));
    }

    public AssistantLastseenNotification create(AssistantLastseenNotification entity) {
        return repository.save(entity);
    }

    public AssistantLastseenNotification update(Integer id, AssistantLastseenNotification entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_LastSeen_Notification not found");
        }
        entity.setAssistant_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_LastSeen_Notification not found");
        }
        repository.deleteById(id);
    }
}
