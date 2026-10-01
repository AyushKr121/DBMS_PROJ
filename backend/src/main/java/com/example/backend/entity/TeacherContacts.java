package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.TeacherContactsId;

@Entity
@IdClass(TeacherContactsId.class)
@Table(name = "Teacher_Contacts")
public class TeacherContacts {

    @Id
    @Column(name = "Teacher_id")
    private Integer Teacher_id;

    @Id
    @Column(name = "Phone_no")
    private String Phone_no;

    public TeacherContacts() {}

    public Integer getTeacher_id() {
        return Teacher_id;
    }

    public void setTeacher_id(Integer Teacher_id) {
        this.Teacher_id = Teacher_id;
    }

    public String getPhone_no() {
        return Phone_no;
    }

    public void setPhone_no(String Phone_no) {
        this.Phone_no = Phone_no;
    }

}