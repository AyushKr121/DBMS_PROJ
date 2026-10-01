package com.example.backend.repository;

import com.example.backend.entity.TeacherSalaryDetails;
import com.example.backend.entity.id.TeacherSalaryDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherSalaryDetailsRepository extends JpaRepository<TeacherSalaryDetails, TeacherSalaryDetailsId> {
}
