package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.example.backend.entity.id.TeacherComplaintsId;

@Entity
@IdClass(TeacherComplaintsId.class)
@Table(name = "Teacher_Complaints")
public class TeacherComplaints {

    @Id
    @Column(name = "Complaint_id")
    private Integer Complaint_id;

    @Id
    @Column(name = "Teacher_id")
    private Integer Teacher_id;

    @Column(name = "Title")
    private String Title;

    @Column(name = "Complaint_date")
    private LocalDate Complaint_date;

    @Column(name = "Complaint_time")
    private LocalTime Complaint_time;

    @Column(name = "Complaint_description")
    private String Complaint_description;

    public TeacherComplaints() {}

    public Integer getComplaint_id() {
        return Complaint_id;
    }

    public void setComplaint_id(Integer Complaint_id) {
        this.Complaint_id = Complaint_id;
    }

    public Integer getTeacher_id() {
        return Teacher_id;
    }

    public void setTeacher_id(Integer Teacher_id) {
        this.Teacher_id = Teacher_id;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public LocalDate getComplaint_date() {
        return Complaint_date;
    }

    public void setComplaint_date(LocalDate Complaint_date) {
        this.Complaint_date = Complaint_date;
    }

    public LocalTime getComplaint_time() {
        return Complaint_time;
    }

    public void setComplaint_time(LocalTime Complaint_time) {
        this.Complaint_time = Complaint_time;
    }

    public String getComplaint_description() {
        return Complaint_description;
    }

    public void setComplaint_description(String Complaint_description) {
        this.Complaint_description = Complaint_description;
    }

}