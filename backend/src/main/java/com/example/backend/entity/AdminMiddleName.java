package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.AdminMiddleNameId;

@Entity
@IdClass(AdminMiddleNameId.class)
@Table(name = "Admin_Middle_Name")
public class AdminMiddleName {

    @Id
    @Column(name = "Sequence_No")
    private Integer Sequence_No;

    @Id
    @Column(name = "Admin_id")
    private Integer Admin_id;

    @Column(name = "Middle_Name")
    private String Middle_Name;

    public AdminMiddleName() {}

    public Integer getSequence_No() {
        return Sequence_No;
    }

    public void setSequence_No(Integer Sequence_No) {
        this.Sequence_No = Sequence_No;
    }

    public Integer getAdmin_id() {
        return Admin_id;
    }

    public void setAdmin_id(Integer Admin_id) {
        this.Admin_id = Admin_id;
    }

    public String getMiddle_Name() {
        return Middle_Name;
    }

    public void setMiddle_Name(String Middle_Name) {
        this.Middle_Name = Middle_Name;
    }

}