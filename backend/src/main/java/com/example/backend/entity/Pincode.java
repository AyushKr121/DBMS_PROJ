package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Pincode")
public class Pincode {

    @Id
    @Column(name = "Pincode")
    private String Pincode;

    @Column(name = "City")
    private String City;

    @Column(name = "State")
    private String State;

    public Pincode() {}

    public String getPincode() {
        return Pincode;
    }

    public void setPincode(String Pincode) {
        this.Pincode = Pincode;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String City) {
        this.City = City;
    }

    public String getState() {
        return State;
    }

    public void setState(String State) {
        this.State = State;
    }

}