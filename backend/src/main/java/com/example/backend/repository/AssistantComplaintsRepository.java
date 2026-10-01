package com.example.backend.repository;

import com.example.backend.entity.AssistantComplaints;
import com.example.backend.entity.id.AssistantComplaintsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantComplaintsRepository extends JpaRepository<AssistantComplaints, AssistantComplaintsId> {
}
