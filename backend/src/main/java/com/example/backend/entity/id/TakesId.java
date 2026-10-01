package com.example.backend.entity.id;

import java.io.Serializable;

public class TakesId implements Serializable {

    private Integer Student_id;

    private Integer Batch_id;

    private Integer Test_id;

    public TakesId() {}

    public TakesId(Integer Student_id, Integer Batch_id, Integer Test_id) {
        this.Student_id = Student_id;
        this.Batch_id = Batch_id;
        this.Test_id = Test_id;
    }

    public Integer getStudent_id() { return Student_id; }
    public void setStudent_id(Integer Student_id) { this.Student_id = Student_id; }

    public Integer getBatch_id() { return Batch_id; }
    public void setBatch_id(Integer Batch_id) { this.Batch_id = Batch_id; }

    public Integer getTest_id() { return Test_id; }
    public void setTest_id(Integer Test_id) { this.Test_id = Test_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TakesId other)) return false;
        return java.util.Objects.equals(Student_id, other.Student_id) && java.util.Objects.equals(Batch_id, other.Batch_id) && java.util.Objects.equals(Test_id, other.Test_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Student_id, Batch_id, Test_id);
    }
}