package com.example.backend.repository;

import com.example.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    @Modifying
    @Query("update Student s set s.LastSeen_Global_Notification_id = :notificationId where s.Student_id = :studentId")
    int updateLastSeenNotification(@Param("studentId") Integer studentId, @Param("notificationId") Integer notificationId);
}
