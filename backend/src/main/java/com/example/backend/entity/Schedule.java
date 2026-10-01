package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.ScheduleId;

@Entity
@IdClass(ScheduleId.class)
@Table(name = "Schedule")
public class Schedule {

    @Id
    @Column(name = "Day")
    private String Day;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    public Schedule() {}

    public String getDay() {
        return Day;
    }

    public void setDay(String Day) {
        this.Day = Day;
    }

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

}