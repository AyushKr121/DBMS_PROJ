package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.backend.entity.id.EnrollmentId;

@Entity
@IdClass(EnrollmentId.class)
@Table(name = "Enrollment")
public class Enrollment {

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Batch_Notification_Status")
    private Boolean Batch_Notification_Status;

    @Column(name = "Enrollment_date")
    private LocalDate Enrollment_date;

    @Column(name = "Feedback")
    private String Feedback;

    @Column(name = "Certificate")
    private String Certificate;

    @Column(name = "Discount")
    private BigDecimal Discount;

    public Enrollment() {}

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

    public Boolean getBatch_Notification_Status() {
        return Batch_Notification_Status;
    }

    public void setBatch_Notification_Status(Boolean Batch_Notification_Status) {
        this.Batch_Notification_Status = Batch_Notification_Status;
    }

    public LocalDate getEnrollment_date() {
        return Enrollment_date;
    }

    public void setEnrollment_date(LocalDate Enrollment_date) {
        this.Enrollment_date = Enrollment_date;
    }

    public String getFeedback() {
        return Feedback;
    }

    public void setFeedback(String Feedback) {
        this.Feedback = Feedback;
    }

    public String getCertificate() {
        return Certificate;
    }

    public void setCertificate(String Certificate) {
        this.Certificate = Certificate;
    }

    public BigDecimal getDiscount() {
        return Discount;
    }

    public void setDiscount(BigDecimal Discount) {
        this.Discount = Discount;
    }

}