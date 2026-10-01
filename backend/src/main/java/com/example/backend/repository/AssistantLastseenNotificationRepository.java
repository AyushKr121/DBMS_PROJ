package com.example.backend.repository;

import com.example.backend.entity.AssistantLastseenNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistantLastseenNotificationRepository extends JpaRepository<AssistantLastseenNotification, Integer> {
}
