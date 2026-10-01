package com.example.backend.repository;

import com.example.backend.entity.Enrollment;
import com.example.backend.entity.id.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
}
