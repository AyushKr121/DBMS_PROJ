package com.example.backend.repository;

import com.example.backend.entity.TeacherContacts;
import com.example.backend.entity.id.TeacherContactsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherContactsRepository extends JpaRepository<TeacherContacts, TeacherContactsId> {
}
