package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.AssistantContactsId;

@Entity
@IdClass(AssistantContactsId.class)
@Table(name = "Assistant_Contacts")
public class AssistantContacts {

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Id
    @Column(name = "Phone_no")
    private String Phone_no;

    public AssistantContacts() {}

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public String getPhone_no() {
        return Phone_no;
    }

    public void setPhone_no(String Phone_no) {
        this.Phone_no = Phone_no;
    }

}