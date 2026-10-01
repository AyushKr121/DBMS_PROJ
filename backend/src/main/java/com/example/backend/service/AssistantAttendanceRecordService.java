package com.example.backend.service;

import com.example.backend.entity.AssistantAttendanceRecord;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AssistantAttendanceRecordRepository;
import com.example.backend.entity.id.AssistantAttendanceRecordId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantAttendanceRecordService {

    private final AssistantAttendanceRecordRepository repository;

    public AssistantAttendanceRecordService(AssistantAttendanceRecordRepository repository) {
        this.repository = repository;
    }

    public List<AssistantAttendanceRecord> getAll() {
        return repository.findAll();
    }

    public AssistantAttendanceRecord getById(AssistantAttendanceRecordId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistant_Attendance_Record not found"));
    }

    public AssistantAttendanceRecord create(AssistantAttendanceRecord entity) {
        return repository.save(entity);
    }

    @Transactional
    public AssistantAttendanceRecord update(AssistantAttendanceRecordId id, AssistantAttendanceRecord entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Attendance_Record not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(AssistantAttendanceRecordId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Assistant_Attendance_Record not found");
        }
        repository.deleteById(id);
    }
}
