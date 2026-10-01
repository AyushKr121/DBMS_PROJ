package com.example.backend.repository;

import com.example.backend.entity.Test;
import com.example.backend.entity.id.TestId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, TestId> {
}
