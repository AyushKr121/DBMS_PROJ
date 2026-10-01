package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.example.backend.entity.id.AssistantComplaintsId;

@Entity
@IdClass(AssistantComplaintsId.class)
@Table(name = "Assistant_Complaints")
public class AssistantComplaints {

    @Id
    @Column(name = "Complaint_id")
    private Integer Complaint_id;

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "Complaint_description")
    private String Complaint_description;

    @Column(name = "Complaint_Title")
    private String Complaint_Title;

    @Column(name = "Complaint_date")
    private LocalDate Complaint_date;

    @Column(name = "Complaint_time")
    private LocalTime Complaint_time;

    public AssistantComplaints() {}

    public Integer getComplaint_id() {
        return Complaint_id;
    }

    public void setComplaint_id(Integer Complaint_id) {
        this.Complaint_id = Complaint_id;
    }

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public String getComplaint_description() {
        return Complaint_description;
    }

    public void setComplaint_description(String Complaint_description) {
        this.Complaint_description = Complaint_description;
    }

    public String getComplaint_Title() {
        return Complaint_Title;
    }

    public void setComplaint_Title(String Complaint_Title) {
        this.Complaint_Title = Complaint_Title;
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

}