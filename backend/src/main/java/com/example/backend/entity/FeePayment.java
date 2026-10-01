package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Fee_Payment")
public class FeePayment {

    @Id
    @Column(name = "Receipt_id")
    private Integer Receipt_id;

    @Column(name = "Student_id")
    private Integer Student_id;

    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Amount")
    private BigDecimal Amount;

    @Column(name = "Payment_date")
    private LocalDate Payment_date;

    @Column(name = "Payment_time")
    private LocalTime Payment_time;

    @Column(name = "Mode_of_payment")
    private String Mode_of_payment;

    public FeePayment() {}

    public Integer getReceipt_id() {
        return Receipt_id;
    }

    public void setReceipt_id(Integer Receipt_id) {
        this.Receipt_id = Receipt_id;
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

    public BigDecimal getAmount() {
        return Amount;
    }

    public void setAmount(BigDecimal Amount) {
        this.Amount = Amount;
    }

    public LocalDate getPayment_date() {
        return Payment_date;
    }

    public void setPayment_date(LocalDate Payment_date) {
        this.Payment_date = Payment_date;
    }

    public LocalTime getPayment_time() {
        return Payment_time;
    }

    public void setPayment_time(LocalTime Payment_time) {
        this.Payment_time = Payment_time;
    }

    public String getMode_of_payment() {
        return Mode_of_payment;
    }

    public void setMode_of_payment(String Mode_of_payment) {
        this.Mode_of_payment = Mode_of_payment;
    }

}