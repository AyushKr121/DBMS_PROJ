package com.example.backend.entity.id;

import java.io.Serializable;

public class StudentComplaintsId implements Serializable {

    private Integer Complaint_id;

    private Integer Student_id;

    public StudentComplaintsId() {}

    public StudentComplaintsId(Integer Complaint_id, Integer Student_id) {
        this.Complaint_id = Complaint_id;
        this.Student_id = Student_id;
    }

    public Integer getComplaint_id() { return Complaint_id; }
    public void setComplaint_id(Integer Complaint_id) { this.Complaint_id = Complaint_id; }

    public Integer getStudent_id() { return Student_id; }
    public void setStudent_id(Integer Student_id) { this.Student_id = Student_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentComplaintsId other)) return false;
        return java.util.Objects.equals(Complaint_id, other.Complaint_id) && java.util.Objects.equals(Student_id, other.Student_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Complaint_id, Student_id);
    }
}