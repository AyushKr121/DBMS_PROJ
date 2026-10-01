package com.example.backend.repository;

import com.example.backend.entity.BatchNotification;
import com.example.backend.entity.id.BatchNotificationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchNotificationRepository extends JpaRepository<BatchNotification, BatchNotificationId> {
}
