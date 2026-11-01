package com.example.backend.repository;

import com.example.backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

    @Modifying
    @Query("update Teacher t set t.LastSeen_Global_Notification_id = :notificationId where t.Teacher_id = :teacherId")
    int updateLastSeenNotification(@Param("teacherId") Integer teacherId, @Param("notificationId") Integer notificationId);
}
