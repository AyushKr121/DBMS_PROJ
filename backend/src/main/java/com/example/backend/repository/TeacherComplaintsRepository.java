package com.example.backend.repository;

import com.example.backend.entity.TeacherComplaints;
import com.example.backend.entity.id.TeacherComplaintsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherComplaintsRepository extends JpaRepository<TeacherComplaints, TeacherComplaintsId> {
}
