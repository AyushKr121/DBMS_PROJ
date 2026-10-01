package com.example.backend.repository;

import com.example.backend.entity.AssistantContacts;
import com.example.backend.entity.id.AssistantContactsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantContactsRepository extends JpaRepository<AssistantContacts, AssistantContactsId> {
}
