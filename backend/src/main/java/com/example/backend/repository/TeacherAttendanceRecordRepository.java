package com.example.backend.repository;

import com.example.backend.entity.TeacherAttendanceRecord;
import com.example.backend.entity.id.TeacherAttendanceRecordId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherAttendanceRecordRepository extends JpaRepository<TeacherAttendanceRecord, TeacherAttendanceRecordId> {
}
