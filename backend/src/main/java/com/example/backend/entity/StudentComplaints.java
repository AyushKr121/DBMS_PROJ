package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.example.backend.entity.id.StudentComplaintsId;

@Entity
@IdClass(StudentComplaintsId.class)
@Table(name = "Student_Complaints")
public class StudentComplaints {

    @Id
    @Column(name = "Complaint_id")
    private Integer Complaint_id;

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Column(name = "Title")
    private String Title;

    @Column(name = "Complaint_date")
    private LocalDate Complaint_date;

    @Column(name = "Complaint_time")
    private LocalTime Complaint_time;

    @Column(name = "Complaint_description")
    private String Complaint_description;

    public StudentComplaints() {}

    public Integer getComplaint_id() {
        return Complaint_id;
    }

    public void setComplaint_id(Integer Complaint_id) {
        this.Complaint_id = Complaint_id;
    }

    public Integer getStudent_id() {
        return Student_id;
    }

    public void setStudent_id(Integer Student_id) {
        this.Student_id = Student_id;
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