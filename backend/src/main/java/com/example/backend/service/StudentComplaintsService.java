package com.example.backend.service;

import com.example.backend.entity.StudentComplaints;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentComplaintsRepository;
import com.example.backend.entity.id.StudentComplaintsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentComplaintsService {

    private final StudentComplaintsRepository repository;

    public StudentComplaintsService(StudentComplaintsRepository repository) {
        this.repository = repository;
    }

    public List<StudentComplaints> getAll() {
        return repository.findAll();
    }

    public StudentComplaints getById(StudentComplaintsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student_Complaints not found"));
    }

    public StudentComplaints create(StudentComplaints entity) {
        return repository.save(entity);
    }

    @Transactional
    public StudentComplaints update(StudentComplaintsId id, StudentComplaints entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Complaints not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(StudentComplaintsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Complaints not found");
        }
        repository.deleteById(id);
    }
}
