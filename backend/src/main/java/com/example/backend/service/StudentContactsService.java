package com.example.backend.service;

import com.example.backend.entity.StudentContacts;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentContactsRepository;
import com.example.backend.entity.id.StudentContactsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentContactsService {

    private final StudentContactsRepository repository;

    public StudentContactsService(StudentContactsRepository repository) {
        this.repository = repository;
    }

    public List<StudentContacts> getAll() {
        return repository.findAll();
    }

    public StudentContacts getById(StudentContactsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student_Contacts not found"));
    }

    public StudentContacts create(StudentContacts entity) {
        return repository.save(entity);
    }

    @Transactional
    public StudentContacts update(StudentContactsId id, StudentContacts entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Contacts not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(StudentContactsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Contacts not found");
        }
        repository.deleteById(id);
    }
}
