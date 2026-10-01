package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.StudentMiddleNameId;

@Entity
@IdClass(StudentMiddleNameId.class)
@Table(name = "Student_Middle_Name")
public class StudentMiddleName {

    @Id
    @Column(name = "Sequence_No")
    private Integer Sequence_No;

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Column(name = "Middle_Name")
    private String Middle_Name;

    public StudentMiddleName() {}

    public Integer getSequence_No() {
        return Sequence_No;
    }

    public void setSequence_No(Integer Sequence_No) {
        this.Sequence_No = Sequence_No;
    }

    public Integer getStudent_id() {
        return Student_id;
    }

    public void setStudent_id(Integer Student_id) {
        this.Student_id = Student_id;
    }

    public String getMiddle_Name() {
        return Middle_Name;
    }

    public void setMiddle_Name(String Middle_Name) {
        this.Middle_Name = Middle_Name;
    }

}