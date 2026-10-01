package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Assistant")
public class Assistant {

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "First_name")
    private String First_name;

    @Column(name = "Last_name")
    private String Last_name;

    @Column(name = "Aadhar_id")
    private String Aadhar_id;

    @Column(name = "DOB")
    private LocalDate DOB;

    @Column(name = "Email")
    private String Email;

    @Column(name = "Credential")
    private String Credential;

    @Column(name = "Sex")
    private String Sex;

    @Column(name = "Salary")
    private BigDecimal Salary;

    @Column(name = "House_no")
    private String House_no;

    @Column(name = "Street")
    private String Street;

    @Column(name = "Pincode")
    private String Pincode;

    public Assistant() {}

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public String getFirst_name() {
        return First_name;
    }

    public void setFirst_name(String First_name) {
        this.First_name = First_name;
    }

    public String getLast_name() {
        return Last_name;
    }

    public void setLast_name(String Last_name) {
        this.Last_name = Last_name;
    }

    public String getAadhar_id() {
        return Aadhar_id;
    }

    public void setAadhar_id(String Aadhar_id) {
        this.Aadhar_id = Aadhar_id;
    }

    public LocalDate getDOB() {
        return DOB;
    }

    public void setDOB(LocalDate DOB) {
        this.DOB = DOB;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }

    public String getCredential() {
        return Credential;
    }

    public void setCredential(String Credential) {
        this.Credential = Credential;
    }

    public String getSex() {
        return Sex;
    }

    public void setSex(String Sex) {
        this.Sex = Sex;
    }

    public BigDecimal getSalary() {
        return Salary;
    }

    public void setSalary(BigDecimal Salary) {
        this.Salary = Salary;
    }

    public String getHouse_no() {
        return House_no;
    }

    public void setHouse_no(String House_no) {
        this.House_no = House_no;
    }

    public String getStreet() {
        return Street;
    }

    public void setStreet(String Street) {
        this.Street = Street;
    }

    public String getPincode() {
        return Pincode;
    }

    public void setPincode(String Pincode) {
        this.Pincode = Pincode;
    }

}