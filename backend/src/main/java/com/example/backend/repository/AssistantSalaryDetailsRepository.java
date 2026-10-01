package com.example.backend.repository;

import com.example.backend.entity.AssistantSalaryDetails;
import com.example.backend.entity.id.AssistantSalaryDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantSalaryDetailsRepository extends JpaRepository<AssistantSalaryDetails, AssistantSalaryDetailsId> {
}
