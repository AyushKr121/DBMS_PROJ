package com.example.backend.repository;

import com.example.backend.entity.Assistant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantRepository extends JpaRepository<Assistant, Integer> {
}
