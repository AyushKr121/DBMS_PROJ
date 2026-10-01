package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.backend.entity.id.TeacherAttendanceRecordId;

@Entity
@IdClass(TeacherAttendanceRecordId.class)
@Table(name = "Teacher_Attendance_Record")
public class TeacherAttendanceRecord {

    @Id
    @Column(name = "Date")
    private LocalDate Date;

    @Id
    @Column(name = "Teacher_id")
    private Integer Teacher_id;

    @Column(name = "Status")
    private BigDecimal Status;

    public TeacherAttendanceRecord() {}

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate Date) {
        this.Date = Date;
    }

    public Integer getTeacher_id() {
        return Teacher_id;
    }

    public void setTeacher_id(Integer Teacher_id) {
        this.Teacher_id = Teacher_id;
    }

    public BigDecimal getStatus() {
        return Status;
    }

    public void setStatus(BigDecimal Status) {
        this.Status = Status;
    }

}