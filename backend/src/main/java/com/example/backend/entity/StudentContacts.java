package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.StudentContactsId;

@Entity
@IdClass(StudentContactsId.class)
@Table(name = "Student_Contacts")
public class StudentContacts {

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Id
    @Column(name = "Phone_no")
    private String Phone_no;

    public StudentContacts() {}

    public Integer getStudent_id() {
        return Student_id;
    }

    public void setStudent_id(Integer Student_id) {
        this.Student_id = Student_id;
    }

    public String getPhone_no() {
        return Phone_no;
    }

    public void setPhone_no(String Phone_no) {
        this.Phone_no = Phone_no;
    }

}