package com.example.backend.entity.id;

import java.io.Serializable;

public class TestId implements Serializable {

    private Integer Test_id;

    private Integer Batch_id;

    public TestId() {}

    public TestId(Integer Test_id, Integer Batch_id) {
        this.Test_id = Test_id;
        this.Batch_id = Batch_id;
    }

    public Integer getTest_id() { return Test_id; }
    public void setTest_id(Integer Test_id) { this.Test_id = Test_id; }

    public Integer getBatch_id() { return Batch_id; }
    public void setBatch_id(Integer Batch_id) { this.Batch_id = Batch_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TestId other)) return false;
        return java.util.Objects.equals(Test_id, other.Test_id) && java.util.Objects.equals(Batch_id, other.Batch_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Test_id, Batch_id);
    }
}