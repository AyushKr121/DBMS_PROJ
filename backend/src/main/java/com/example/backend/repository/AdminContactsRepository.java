package com.example.backend.repository;

import com.example.backend.entity.AdminContacts;
import com.example.backend.entity.id.AdminContactsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminContactsRepository extends JpaRepository<AdminContacts, AdminContactsId> {
}
