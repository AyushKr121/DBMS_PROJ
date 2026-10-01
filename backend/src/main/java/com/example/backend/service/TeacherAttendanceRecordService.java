package com.example.backend.service;

import com.example.backend.entity.TeacherAttendanceRecord;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TeacherAttendanceRecordRepository;
import com.example.backend.entity.id.TeacherAttendanceRecordId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherAttendanceRecordService {

    private final TeacherAttendanceRecordRepository repository;

    public TeacherAttendanceRecordService(TeacherAttendanceRecordRepository repository) {
        this.repository = repository;
    }

    public List<TeacherAttendanceRecord> getAll() {
        return repository.findAll();
    }

    public TeacherAttendanceRecord getById(TeacherAttendanceRecordId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher_Attendance_Record not found"));
    }

    public TeacherAttendanceRecord create(TeacherAttendanceRecord entity) {
        return repository.save(entity);
    }

    @Transactional
    public TeacherAttendanceRecord update(TeacherAttendanceRecordId id, TeacherAttendanceRecord entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Attendance_Record not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(TeacherAttendanceRecordId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher_Attendance_Record not found");
        }
        repository.deleteById(id);
    }
}
