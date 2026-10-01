package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.AdminContactsId;

@Entity
@IdClass(AdminContactsId.class)
@Table(name = "Admin_Contacts")
public class AdminContacts {

    @Id
    @Column(name = "Admin_id")
    private Integer Admin_id;

    @Id
    @Column(name = "Phone_no")
    private String Phone_no;

    public AdminContacts() {}

    public Integer getAdmin_id() {
        return Admin_id;
    }

    public void setAdmin_id(Integer Admin_id) {
        this.Admin_id = Admin_id;
    }

    public String getPhone_no() {
        return Phone_no;
    }

    public void setPhone_no(String Phone_no) {
        this.Phone_no = Phone_no;
    }

}