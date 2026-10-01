package com.example.backend.service;

import com.example.backend.entity.Schedule;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ScheduleRepository;
import com.example.backend.entity.id.ScheduleId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository repository;

    public ScheduleService(ScheduleRepository repository) {
        this.repository = repository;
    }

    public List<Schedule> getAll() {
        return repository.findAll();
    }

    public Schedule getById(ScheduleId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
    }

    public Schedule create(Schedule entity) {
        return repository.save(entity);
    }

    @Transactional
    public Schedule update(ScheduleId id, Schedule entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found");
        }
        repository.deleteById(id);
        return repository.save(entity);
    }

    public void delete(ScheduleId id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found");
        }
        repository.deleteById(id);
    }
}
