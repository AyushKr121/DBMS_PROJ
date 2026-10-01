package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.TeacherMiddleNameId;

@Entity
@IdClass(TeacherMiddleNameId.class)
@Table(name = "Teacher_Middle_Name")
public class TeacherMiddleName {

    @Id
    @Column(name = "Sequence_No")
    private Integer Sequence_No;

    @Id
    @Column(name = "Teacher_id")
    private Integer Teacher_id;

    @Column(name = "Middle_Name")
    private String Middle_Name;

    public TeacherMiddleName() {}

    public Integer getSequence_No() {
        return Sequence_No;
    }

    public void setSequence_No(Integer Sequence_No) {
        this.Sequence_No = Sequence_No;
    }

    public Integer getTeacher_id() {
        return Teacher_id;
    }

    public void setTeacher_id(Integer Teacher_id) {
        this.Teacher_id = Teacher_id;
    }

    public String getMiddle_Name() {
        return Middle_Name;
    }

    public void setMiddle_Name(String Middle_Name) {
        this.Middle_Name = Middle_Name;
    }

}