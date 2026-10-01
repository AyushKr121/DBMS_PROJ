package com.example.backend.repository;

import com.example.backend.entity.StudentContacts;
import com.example.backend.entity.id.StudentContactsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentContactsRepository extends JpaRepository<StudentContacts, StudentContactsId> {
}
