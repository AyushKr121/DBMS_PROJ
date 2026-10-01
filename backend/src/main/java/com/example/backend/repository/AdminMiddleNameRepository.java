package com.example.backend.repository;

import com.example.backend.entity.AdminMiddleName;
import com.example.backend.entity.id.AdminMiddleNameId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminMiddleNameRepository extends JpaRepository<AdminMiddleName, AdminMiddleNameId> {
}
