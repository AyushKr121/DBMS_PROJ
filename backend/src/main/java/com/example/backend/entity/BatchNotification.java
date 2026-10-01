package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.BatchNotificationId;

@Entity
@IdClass(BatchNotificationId.class)
@Table(name = "Batch_Notification")
public class BatchNotification {

    @Id
    @Column(name = "Notification_id")
    private Integer Notification_id;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Description")
    private String Description;

    @Column(name = "Title")
    private String Title;

    public BatchNotification() {}

    public Integer getNotification_id() {
        return Notification_id;
    }

    public void setNotification_id(Integer Notification_id) {
        this.Notification_id = Notification_id;
    }

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

}