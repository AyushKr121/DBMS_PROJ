package com.example.backend.repository;

import com.example.backend.entity.AssistantAttendanceRecord;
import com.example.backend.entity.id.AssistantAttendanceRecordId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantAttendanceRecordRepository extends JpaRepository<AssistantAttendanceRecord, AssistantAttendanceRecordId> {
}
