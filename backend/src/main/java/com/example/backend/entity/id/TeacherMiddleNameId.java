package com.example.backend.entity.id;

import java.io.Serializable;

public class TeacherMiddleNameId implements Serializable {

    private Integer Sequence_No;

    private Integer Teacher_id;

    public TeacherMiddleNameId() {}

    public TeacherMiddleNameId(Integer Sequence_No, Integer Teacher_id) {
        this.Sequence_No = Sequence_No;
        this.Teacher_id = Teacher_id;
    }

    public Integer getSequence_No() { return Sequence_No; }
    public void setSequence_No(Integer Sequence_No) { this.Sequence_No = Sequence_No; }

    public Integer getTeacher_id() { return Teacher_id; }
    public void setTeacher_id(Integer Teacher_id) { this.Teacher_id = Teacher_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherMiddleNameId other)) return false;
        return java.util.Objects.equals(Sequence_No, other.Sequence_No) && java.util.Objects.equals(Teacher_id, other.Teacher_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Sequence_No, Teacher_id);
    }
}