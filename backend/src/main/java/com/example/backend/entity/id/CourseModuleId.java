package com.example.backend.entity.id;

import java.io.Serializable;

public class CourseModuleId implements Serializable {

    private Integer Module_id;

    private Integer Course_id;

    public CourseModuleId() {}

    public CourseModuleId(Integer Module_id, Integer Course_id) {
        this.Module_id = Module_id;
        this.Course_id = Course_id;
    }

    public Integer getModule_id() { return Module_id; }
    public void setModule_id(Integer Module_id) { this.Module_id = Module_id; }

    public Integer getCourse_id() { return Course_id; }
    public void setCourse_id(Integer Course_id) { this.Course_id = Course_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CourseModuleId other)) return false;
        return java.util.Objects.equals(Module_id, other.Module_id) && java.util.Objects.equals(Course_id, other.Course_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Module_id, Course_id);
    }
}