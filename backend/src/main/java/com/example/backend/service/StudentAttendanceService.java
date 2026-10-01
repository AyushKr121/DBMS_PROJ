package com.example.backend.service;

import com.example.backend.entity.StudentAttendance;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.StudentAttendanceRepository;
import com.example.backend.entity.id.StudentAttendanceId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentAttendanceService {

    private final StudentAttendanceRepository repository;

    public StudentAttendanceService(StudentAttendanceRepository repository) {
        this.repository = repository;
    }

    public List<StudentAttendance> getAll() {
        return repository.findAll();
    }

    public StudentAttendance getById(StudentAttendanceId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student_Attendance not found"));
    }

    public StudentAttendance create(StudentAttendance entity) {
        return repository.save(entity);
    }

    @Transactional
    public StudentAttendance update(StudentAttendanceId id, StudentAttendance entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Attendance not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(StudentAttendanceId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student_Attendance not found");
        }
        repository.deleteById(id);
    }
}
