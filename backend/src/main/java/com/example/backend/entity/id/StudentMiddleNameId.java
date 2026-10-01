package com.example.backend.entity.id;

import java.io.Serializable;

public class StudentMiddleNameId implements Serializable {

    private Integer Sequence_No;

    private Integer Student_id;

    public StudentMiddleNameId() {}

    public StudentMiddleNameId(Integer Sequence_No, Integer Student_id) {
        this.Sequence_No = Sequence_No;
        this.Student_id = Student_id;
    }

    public Integer getSequence_No() { return Sequence_No; }
    public void setSequence_No(Integer Sequence_No) { this.Sequence_No = Sequence_No; }

    public Integer getStudent_id() { return Student_id; }
    public void setStudent_id(Integer Student_id) { this.Student_id = Student_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentMiddleNameId other)) return false;
        return java.util.Objects.equals(Sequence_No, other.Sequence_No) && java.util.Objects.equals(Student_id, other.Student_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Sequence_No, Student_id);
    }
}