package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Course")
public class Course {

    @Id
    @Column(name = "Course_id")
    private Integer Course_id;

    @Column(name = "Course_Name")
    private String Course_Name;

    @Column(name = "Description")
    private String Description;

    @Column(name = "Price")
    private BigDecimal Price;

    @Column(name = "No_of_modules")
    private Integer No_of_modules;

    @Column(name = "No_of_weeks")
    private Integer No_of_weeks;

    @Column(name = "Material")
    private String Material;

    @Column(name = "Category")
    private String Category;

    public Course() {}

    public Integer getCourse_id() {
        return Course_id;
    }

    public void setCourse_id(Integer Course_id) {
        this.Course_id = Course_id;
    }

    public String getCourse_Name() {
        return Course_Name;
    }

    public void setCourse_Name(String Course_Name) {
        this.Course_Name = Course_Name;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public BigDecimal getPrice() {
        return Price;
    }

    public void setPrice(BigDecimal Price) {
        this.Price = Price;
    }

    public Integer getNo_of_modules() {
        return No_of_modules;
    }

    public void setNo_of_modules(Integer No_of_modules) {
        this.No_of_modules = No_of_modules;
    }

    public Integer getNo_of_weeks() {
        return No_of_weeks;
    }

    public void setNo_of_weeks(Integer No_of_weeks) {
        this.No_of_weeks = No_of_weeks;
    }

    public String getMaterial() {
        return Material;
    }

    public void setMaterial(String Material) {
        this.Material = Material;
    }

    public String getCategory() {
        return Category;
    }

    public void setCategory(String Category) {
        this.Category = Category;
    }

}