package com.example.backend.repository;

import com.example.backend.entity.StudentAttendance;
import com.example.backend.entity.id.StudentAttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, StudentAttendanceId> {
}
