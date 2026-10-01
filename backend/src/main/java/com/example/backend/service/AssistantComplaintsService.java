package com.example.backend.service;

import com.example.backend.entity.AssistantComplaints;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantComplaintsRepository;
import com.example.backend.entity.id.AssistantComplaintsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantComplaintsService {

    private final AssistantComplaintsRepository repository;

    public AssistantComplaintsService(AssistantComplaintsRepository repository) {
        this.repository = repository;
    }

    public List<AssistantComplaints> getAll() {
        return repository.findAll();
    }

    public AssistantComplaints getById(AssistantComplaintsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Complaints not found"));
    }

    public AssistantComplaints create(AssistantComplaints entity) {
        return repository.save(entity);
    }

    @Transactional
    public AssistantComplaints update(AssistantComplaintsId id, AssistantComplaints entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Complaints not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AssistantComplaintsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Complaints not found");
        }
        repository.deleteById(id);
    }
}
