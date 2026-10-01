package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.example.backend.entity.id.TestId;

@Entity
@IdClass(TestId.class)
@Table(name = "Test")
public class Test {

    @Id
    @Column(name = "Test_id")
    private Integer Test_id;

    @Id
    @Column(name = "Batch_id")
    private Integer Batch_id;

    @Column(name = "Test_title")
    private String Test_title;

    @Column(name = "Date")
    private LocalDate Date;

    @Column(name = "Question_paper_Link")
    private String Question_paper_Link;

    @Column(name = "Answerkey_Link")
    private String Answerkey_Link;

    public Test() {}

    public Integer getTest_id() {
        return Test_id;
    }

    public void setTest_id(Integer Test_id) {
        this.Test_id = Test_id;
    }

    public Integer getBatch_id() {
        return Batch_id;
    }

    public void setBatch_id(Integer Batch_id) {
        this.Batch_id = Batch_id;
    }

    public String getTest_title() {
        return Test_title;
    }

    public void setTest_title(String Test_title) {
        this.Test_title = Test_title;
    }

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate Date) {
        this.Date = Date;
    }

    public String getQuestion_paper_Link() {
        return Question_paper_Link;
    }

    public void setQuestion_paper_Link(String Question_paper_Link) {
        this.Question_paper_Link = Question_paper_Link;
    }

    public String getAnswerkey_Link() {
        return Answerkey_Link;
    }

    public void setAnswerkey_Link(String Answerkey_Link) {
        this.Answerkey_Link = Answerkey_Link;
    }

}