package com.example.backend.repository;

import com.example.backend.entity.TeacherSalaryRecords;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherSalaryRecordsRepository extends JpaRepository<TeacherSalaryRecords, Integer> {
}
