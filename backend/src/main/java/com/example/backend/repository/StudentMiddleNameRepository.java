package com.example.backend.repository;

import com.example.backend.entity.StudentMiddleName;
import com.example.backend.entity.id.StudentMiddleNameId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentMiddleNameRepository extends JpaRepository<StudentMiddleName, StudentMiddleNameId> {
}
