package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.CourseModuleId;

@Entity
@IdClass(CourseModuleId.class)
@Table(name = "Course_Module")
public class CourseModule {

    @Id
    @Column(name = "Module_id")
    private Integer Module_id;

    @Id
    @Column(name = "Course_id")
    private Integer Course_id;

    @Column(name = "Module_title")
    private String Module_title;

    @Column(name = "Module_description")
    private String Module_description;

    public CourseModule() {}

    public Integer getModule_id() {
        return Module_id;
    }

    public void setModule_id(Integer Module_id) {
        this.Module_id = Module_id;
    }

    public Integer getCourse_id() {
        return Course_id;
    }

    public void setCourse_id(Integer Course_id) {
        this.Course_id = Course_id;
    }

    public String getModule_title() {
        return Module_title;
    }

    public void setModule_title(String Module_title) {
        this.Module_title = Module_title;
    }

    public String getModule_description() {
        return Module_description;
    }

    public void setModule_description(String Module_description) {
        this.Module_description = Module_description;
    }

}