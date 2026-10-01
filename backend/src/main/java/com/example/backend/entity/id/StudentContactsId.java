package com.example.backend.entity.id;

import java.io.Serializable;

public class StudentContactsId implements Serializable {

    private Integer Student_id;

    private String Phone_no;

    public StudentContactsId() {}

    public StudentContactsId(Integer Student_id, String Phone_no) {
        this.Student_id = Student_id;
        this.Phone_no = Phone_no;
    }

    public Integer getStudent_id() { return Student_id; }
    public void setStudent_id(Integer Student_id) { this.Student_id = Student_id; }

    public String getPhone_no() { return Phone_no; }
    public void setPhone_no(String Phone_no) { this.Phone_no = Phone_no; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentContactsId other)) return false;
        return java.util.Objects.equals(Student_id, other.Student_id) && java.util.Objects.equals(Phone_no, other.Phone_no);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Student_id, Phone_no);
    }
}