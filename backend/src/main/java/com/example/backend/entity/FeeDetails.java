package com.example.backend.entity;

import jakarta.persistence.*;

import com.example.backend.entity.id.FeeDetailsId;

@Entity
@IdClass(FeeDetailsId.class)
@Table(name = "Fee_Details")
public class FeeDetails {

    @Id
    @Column(name = "Receipt_id")
    private Integer Receipt_id;

    @Id
    @Column(name = "Description")
    private String Description;

    public FeeDetails() {}

    public Integer getReceipt_id() {
        return Receipt_id;
    }

    public void setReceipt_id(Integer Receipt_id) {
        this.Receipt_id = Receipt_id;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

}