package com.example.backend.repository;

import com.example.backend.entity.AssistantMiddleName;
import com.example.backend.entity.id.AssistantMiddleNameId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantMiddleNameRepository extends JpaRepository<AssistantMiddleName, AssistantMiddleNameId> {
}
