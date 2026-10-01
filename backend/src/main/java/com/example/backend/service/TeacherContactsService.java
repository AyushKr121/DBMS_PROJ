package com.example.backend.service;

import com.example.backend.entity.TeacherContacts;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherContactsRepository;
import com.example.backend.entity.id.TeacherContactsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherContactsService {

    private final TeacherContactsRepository repository;

    public TeacherContactsService(TeacherContactsRepository repository) {
        this.repository = repository;
    }

    public List<TeacherContacts> getAll() {
        return repository.findAll();
    }

    public TeacherContacts getById(TeacherContactsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Contacts not found"));
    }

    public TeacherContacts create(TeacherContacts entity) {
        return repository.save(entity);
    }

    @Transactional
    public TeacherContacts update(TeacherContactsId id, TeacherContacts entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Contacts not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TeacherContactsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Contacts not found");
        }
        repository.deleteById(id);
    }
}
