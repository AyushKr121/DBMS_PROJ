package com.example.backend.entity.id;

import java.io.Serializable;

public class BatchNotificationId implements Serializable {

    private Integer Notification_id;

    private Integer Batch_id;

    public BatchNotificationId() {}

    public BatchNotificationId(Integer Notification_id, Integer Batch_id) {
        this.Notification_id = Notification_id;
        this.Batch_id = Batch_id;
    }

    public Integer getNotification_id() { return Notification_id; }
    public void setNotification_id(Integer Notification_id) { this.Notification_id = Notification_id; }

    public Integer getBatch_id() { return Batch_id; }
    public void setBatch_id(Integer Batch_id) { this.Batch_id = Batch_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BatchNotificationId other)) return false;
        return java.util.Objects.equals(Notification_id, other.Notification_id) && java.util.Objects.equals(Batch_id, other.Batch_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Notification_id, Batch_id);
    }
}