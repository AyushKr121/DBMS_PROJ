package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.backend.entity.id.AssistantAttendanceRecordId;

@Entity
@IdClass(AssistantAttendanceRecordId.class)
@Table(name = "Assistant_Attendance_Record")
public class AssistantAttendanceRecord {

    @Id
    @Column(name = "Date")
    private LocalDate Date;

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "Status")
    private BigDecimal Status;

    public AssistantAttendanceRecord() {}

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate Date) {
        this.Date = Date;
    }

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public BigDecimal getStatus() {
        return Status;
    }

    public void setStatus(BigDecimal Status) {
        this.Status = Status;
    }

}