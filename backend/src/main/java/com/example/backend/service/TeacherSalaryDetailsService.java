package com.example.backend.service;

import com.example.backend.entity.TeacherSalaryDetails;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherSalaryDetailsRepository;
import com.example.backend.entity.id.TeacherSalaryDetailsId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherSalaryDetailsService {

    private final TeacherSalaryDetailsRepository repository;

    public TeacherSalaryDetailsService(TeacherSalaryDetailsRepository repository) {
        this.repository = repository;
    }

    public List<TeacherSalaryDetails> getAll() {
        return repository.findAll();
    }

    public TeacherSalaryDetails getById(TeacherSalaryDetailsId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Salary_Details not found"));
    }

    public TeacherSalaryDetails create(TeacherSalaryDetails entity) {
        return repository.save(entity);
    }

    @Transactional
    public TeacherSalaryDetails update(TeacherSalaryDetailsId id, TeacherSalaryDetails entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Salary_Details not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TeacherSalaryDetailsId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Salary_Details not found");
        }
        repository.deleteById(id);
    }
}
