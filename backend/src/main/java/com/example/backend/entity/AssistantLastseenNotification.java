package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Assistant_LastSeen_Notification")
public class AssistantLastseenNotification {

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "LastSeen_Global_Notification_id")
    private Integer LastSeen_Global_Notification_id;

    public AssistantLastseenNotification() {}

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public Integer getLastSeen_Global_Notification_id() {
        return LastSeen_Global_Notification_id;
    }

    public void setLastSeen_Global_Notification_id(Integer LastSeen_Global_Notification_id) {
        this.LastSeen_Global_Notification_id = LastSeen_Global_Notification_id;
    }

}