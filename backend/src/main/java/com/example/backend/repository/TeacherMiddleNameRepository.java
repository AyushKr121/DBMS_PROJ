package com.example.backend.repository;

import com.example.backend.entity.TeacherMiddleName;
import com.example.backend.entity.id.TeacherMiddleNameId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherMiddleNameRepository extends JpaRepository<TeacherMiddleName, TeacherMiddleNameId> {
}
