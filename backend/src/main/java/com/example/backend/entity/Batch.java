package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Batch")
public class Batch {

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Teacher_id")
    private Integer Teacher_id;

    @Column(name = "Course_id")
    private Integer Course_id;

    @Column(name = "Start_date")
    private LocalDate Start_date;

    @Column(name = "Start_time")
    private LocalTime Start_time;

    @Column(name = "End_time")
    private LocalTime End_time;

    @Column(name = "Venue")
    private String Venue;

    @Column(name = "Modules_Completed")
    private Integer Modules_Completed;

    public Batch() {}

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

    public Integer getTeacher_id() {
        return Teacher_id;
    }

    public void setTeacher_id(Integer Teacher_id) {
        this.Teacher_id = Teacher_id;
    }

    public Integer getCourse_id() {
        return Course_id;
    }

    public void setCourse_id(Integer Course_id) {
        this.Course_id = Course_id;
    }

    public LocalDate getStart_date() {
        return Start_date;
    }

    public void setStart_date(LocalDate Start_date) {
        this.Start_date = Start_date;
    }

    public LocalTime getStart_time() {
        return Start_time;
    }

    public void setStart_time(LocalTime Start_time) {
        this.Start_time = Start_time;
    }

    public LocalTime getEnd_time() {
        return End_time;
    }

    public void setEnd_time(LocalTime End_time) {
        this.End_time = End_time;
    }

    public String getVenue() {
        return Venue;
    }

    public void setVenue(String Venue) {
        this.Venue = Venue;
    }

    public Integer getModules_Completed() {
        return Modules_Completed;
    }

    public void setModules_Completed(Integer Modules_Completed) {
        this.Modules_Completed = Modules_Completed;
    }

}