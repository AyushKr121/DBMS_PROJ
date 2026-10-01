package com.example.backend.repository;

import com.example.backend.entity.CourseModule;
import com.example.backend.entity.id.CourseModuleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseModuleRepository extends JpaRepository<CourseModule, CourseModuleId> {
}
