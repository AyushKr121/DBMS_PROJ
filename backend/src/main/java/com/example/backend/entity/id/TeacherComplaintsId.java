package com.example.backend.entity.id;

import java.io.Serializable;

public class TeacherComplaintsId implements Serializable {

    private Integer Complaint_id;

    private Integer Teacher_id;

    public TeacherComplaintsId() {}

    public TeacherComplaintsId(Integer Complaint_id, Integer Teacher_id) {
        this.Complaint_id = Complaint_id;
        this.Teacher_id = Teacher_id;
    }

    public Integer getComplaint_id() { return Complaint_id; }
    public void setComplaint_id(Integer Complaint_id) { this.Complaint_id = Complaint_id; }

    public Integer getTeacher_id() { return Teacher_id; }
    public void setTeacher_id(Integer Teacher_id) { this.Teacher_id = Teacher_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherComplaintsId other)) return false;
        return java.util.Objects.equals(Complaint_id, other.Complaint_id) && java.util.Objects.equals(Teacher_id, other.Teacher_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Complaint_id, Teacher_id);
    }
}