package com.example.backend.service;

import com.example.backend.entity.TeacherComplaints;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherComplaintsRepository;
import com.example.backend.entity.id.TeacherComplaintsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherComplaintsService {

    private final TeacherComplaintsRepository repository;

    public TeacherComplaintsService(TeacherComplaintsRepository repository) {
        this.repository = repository;
    }

    public List<TeacherComplaints> getAll() {
        return repository.findAll();
    }

    public TeacherComplaints getById(TeacherComplaintsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Complaints not found"));
    }

    public TeacherComplaints create(TeacherComplaints entity) {
        return repository.save(entity);
    }

    @Transactional
    public TeacherComplaints update(TeacherComplaintsId id, TeacherComplaints entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Complaints not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TeacherComplaintsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Complaints not found");
        }
        repository.deleteById(id);
    }
}
