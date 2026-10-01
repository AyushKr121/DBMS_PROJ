package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

import com.example.backend.entity.id.TakesId;

@Entity
@IdClass(TakesId.class)
@Table(name = "Takes")
public class Takes {

    @Id
    @Column(name = "Student_id")
    private Integer Student_id;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Id
    @Column(name = "Test_id")
    private Integer Test_id;

    @Column(name = "Score")
    private BigDecimal Score;

    public Takes() {}

    public Integer getStudent_id() {
        return Student_id;
    }

    public void setStudent_id(Integer Student_id) {
        this.Student_id = Student_id;
    }

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

    public Integer getTest_id() {
        return Test_id;
    }

    public void setTest_id(Integer Test_id) {
        this.Test_id = Test_id;
    }

    public BigDecimal getScore() {
        return Score;
    }

    public void setScore(BigDecimal Score) {
        this.Score = Score;
    }

}