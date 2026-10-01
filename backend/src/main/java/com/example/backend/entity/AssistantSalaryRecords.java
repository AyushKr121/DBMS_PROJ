package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Assistant_Salary_Records")
public class AssistantSalaryRecords {

    @Id
    @Column(name = "Receipt_id")
    private Integer Receipt_id;

    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "Amount")
    private BigDecimal Amount;

    @Column(name = "Salary_payment_date")
    private LocalDate Salary_payment_date;

    @Column(name = "Month")
    private Integer Month;

    @Column(name = "Year")
    private Integer Year;

    public AssistantSalaryRecords() {}

    public Integer getReceipt_id() {
        return Receipt_id;
    }

    public void setReceipt_id(Integer Receipt_id) {
        this.Receipt_id = Receipt_id;
    }

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public BigDecimal getAmount() {
        return Amount;
    }

    public void setAmount(BigDecimal Amount) {
        this.Amount = Amount;
    }

    public LocalDate getSalary_payment_date() {
        return Salary_payment_date;
    }

    public void setSalary_payment_date(LocalDate Salary_payment_date) {
        this.Salary_payment_date = Salary_payment_date;
    }

    public Integer getMonth() {
        return Month;
    }

    public void setMonth(Integer Month) {
        this.Month = Month;
    }

    public Integer getYear() {
        return Year;
    }

    public void setYear(Integer Year) {
        this.Year = Year;
    }

}