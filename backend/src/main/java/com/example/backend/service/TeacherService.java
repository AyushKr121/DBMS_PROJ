package com.example.backend.service;

import com.example.backend.entity.Teacher;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository repository;

    public TeacherService(TeacherRepository repository) {
        this.repository = repository;
    }

    public List<Teacher> getAll() {
        return repository.findAll();
    }

    public Teacher getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    public Teacher create(Teacher entity) {
        return repository.save(entity);
    }

    public Teacher update(Integer id, Teacher entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found");
        }
        entity.setTeacher_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found");
        }
        repository.deleteById(id);
    }
}
