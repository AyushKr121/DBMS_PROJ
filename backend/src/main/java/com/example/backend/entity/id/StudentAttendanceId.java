package com.example.backend.entity.id;

import java.io.Serializable;
import java.time.LocalDate;

public class StudentAttendanceId implements Serializable {

    private LocalDate Date;

    private Integer Student_id;

    private Integer Batch_id;

    public StudentAttendanceId() {}

    public StudentAttendanceId(LocalDate Date, Integer Student_id, Integer Batch_id) {
        this.Date = Date;
        this.Student_id = Student_id;
        this.Batch_id = Batch_id;
    }

    public LocalDate getDate() { return Date; }
    public void setDate(LocalDate Date) { this.Date = Date; }

    public Integer getStudent_id() { return Student_id; }
    public void setStudent_id(Integer Student_id) { this.Student_id = Student_id; }

    public Integer getBatch_id() { return Batch_id; }
    public void setBatch_id(Integer Batch_id) { this.Batch_id = Batch_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentAttendanceId other)) return false;
        return java.util.Objects.equals(Date, other.Date) && java.util.Objects.equals(Student_id, other.Student_id) && java.util.Objects.equals(Batch_id, other.Batch_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Date, Student_id, Batch_id);
    }
}