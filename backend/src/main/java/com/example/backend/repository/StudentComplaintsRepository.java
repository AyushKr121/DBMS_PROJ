package com.example.backend.repository;

import com.example.backend.entity.StudentComplaints;
import com.example.backend.entity.id.StudentComplaintsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentComplaintsRepository extends JpaRepository<StudentComplaints, StudentComplaintsId> {
}
