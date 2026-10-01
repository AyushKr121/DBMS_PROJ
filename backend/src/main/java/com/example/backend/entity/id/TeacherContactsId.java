package com.example.backend.entity.id;

import java.io.Serializable;

public class TeacherContactsId implements Serializable {

    private Integer Teacher_id;

    private String Phone_no;

    public TeacherContactsId() {}

    public TeacherContactsId(Integer Teacher_id, String Phone_no) {
        this.Teacher_id = Teacher_id;
        this.Phone_no = Phone_no;
    }

    public Integer getTeacher_id() { return Teacher_id; }
    public void setTeacher_id(Integer Teacher_id) { this.Teacher_id = Teacher_id; }

    public String getPhone_no() { return Phone_no; }
    public void setPhone_no(String Phone_no) { this.Phone_no = Phone_no; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherContactsId other)) return false;
        return java.util.Objects.equals(Teacher_id, other.Teacher_id) && java.util.Objects.equals(Phone_no, other.Phone_no);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Teacher_id, Phone_no);
    }
}