package com.example.backend.entity.id;

import java.io.Serializable;
import java.time.LocalDate;

public class TeacherAttendanceRecordId implements Serializable {

    private LocalDate Date;

    private Integer Teacher_id;

    public TeacherAttendanceRecordId() {}

    public TeacherAttendanceRecordId(LocalDate Date, Integer Teacher_id) {
        this.Date = Date;
        this.Teacher_id = Teacher_id;
    }

    public LocalDate getDate() { return Date; }
    public void setDate(LocalDate Date) { this.Date = Date; }

    public Integer getTeacher_id() { return Teacher_id; }
    public void setTeacher_id(Integer Teacher_id) { this.Teacher_id = Teacher_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherAttendanceRecordId other)) return false;
        return java.util.Objects.equals(Date, other.Date) && java.util.Objects.equals(Teacher_id, other.Teacher_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Date, Teacher_id);
    }
}