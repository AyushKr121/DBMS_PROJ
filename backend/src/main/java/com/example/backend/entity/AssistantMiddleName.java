package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.AssistantMiddleNameId;

@Entity
@IdClass(AssistantMiddleNameId.class)
@Table(name = "Assistant_Middle_Name")
public class AssistantMiddleName {

    @Id
    @Column(name = "Sequence_No")
    private Integer Sequence_No;

    @Id
    @Column(name = "Assistant_id")
    private Integer Assistant_id;

    @Column(name = "Middle_Name")
    private String Middle_Name;

    public AssistantMiddleName() {}

    public Integer getSequence_No() {
        return Sequence_No;
    }

    public void setSequence_No(Integer Sequence_No) {
        this.Sequence_No = Sequence_No;
    }

    public Integer getAssistant_id() {
        return Assistant_id;
    }

    public void setAssistant_id(Integer Assistant_id) {
        this.Assistant_id = Assistant_id;
    }

    public String getMiddle_Name() {
        return Middle_Name;
    }

    public void setMiddle_Name(String Middle_Name) {
        this.Middle_Name = Middle_Name;
    }

}