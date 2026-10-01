package com.example.backend.service;

import com.example.backend.entity.TeacherMiddleName;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherMiddleNameRepository;
import com.example.backend.entity.id.TeacherMiddleNameId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherMiddleNameService {

    private final TeacherMiddleNameRepository repository;

    public TeacherMiddleNameService(TeacherMiddleNameRepository repository) {
        this.repository = repository;
    }

    public List<TeacherMiddleName> getAll() {
        return repository.findAll();
    }

    public TeacherMiddleName getById(TeacherMiddleNameId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Middle_Name not found"));
    }

    public TeacherMiddleName create(TeacherMiddleName entity) {
        return repository.save(entity);
    }

    @Transactional
    public TeacherMiddleName update(TeacherMiddleNameId id, TeacherMiddleName entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Middle_Name not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TeacherMiddleNameId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Middle_Name not found");
        }
        repository.deleteById(id);
    }
}
