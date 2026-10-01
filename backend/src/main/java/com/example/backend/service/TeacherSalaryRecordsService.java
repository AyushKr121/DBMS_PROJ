package com.example.backend.service;

import com.example.backend.entity.TeacherSalaryRecords;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherSalaryRecordsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherSalaryRecordsService {

    private final TeacherSalaryRecordsRepository repository;

    public TeacherSalaryRecordsService(TeacherSalaryRecordsRepository repository) {
        this.repository = repository;
    }

    public List<TeacherSalaryRecords> getAll() {
        return repository.findAll();
    }

    public TeacherSalaryRecords getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Salary_Records not found"));
    }

    public TeacherSalaryRecords create(TeacherSalaryRecords entity) {
        return repository.save(entity);
    }

    public TeacherSalaryRecords update(Integer id, TeacherSalaryRecords entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Salary_Records not found");
        }
        entity.setReceipt_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Salary_Records not found");
        }
        repository.deleteById(id);
    }
}
