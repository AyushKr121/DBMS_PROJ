package com.example.backend.repository;

import com.example.backend.entity.Schedule;
import com.example.backend.entity.id.ScheduleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, ScheduleId> {
}
