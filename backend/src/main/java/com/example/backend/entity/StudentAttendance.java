package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.example.backend.entity.id.StudentAttendanceId;

@Entity
@IdClass(StudentAttendanceId.class)
@Table(name = "Student_Attendance")
public class StudentAttendance {

    @Id
    @Column(name = "Date")
    private LocalDate Date;

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Status")
    private Integer Status;

    public StudentAttendance() {}

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate Date) {
        this.Date = Date;
    }

    public Integer getStudent_id() {
        return Student_id;
    }

    public void setStudent_id(Integer Student_id) {
        this.Student_id = Student_id;
    }

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

    public Integer getStatus() {
        return Status;
    }

    public void setStatus(Integer Status) {
        this.Status = Status;
    }

}