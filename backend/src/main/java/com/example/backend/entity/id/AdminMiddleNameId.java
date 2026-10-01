package com.example.backend.entity.id;

import java.io.Serializable;

public class AdminMiddleNameId implements Serializable {

    private Integer Sequence_No;

    private Integer Admin_id;

    public AdminMiddleNameId() {}

    public AdminMiddleNameId(Integer Sequence_No, Integer Admin_id) {
        this.Sequence_No = Sequence_No;
        this.Admin_id = Admin_id;
    }

    public Integer getSequence_No() { return Sequence_No; }
    public void setSequence_No(Integer Sequence_No) { this.Sequence_No = Sequence_No; }

    public Integer getAdmin_id() { return Admin_id; }
    public void setAdmin_id(Integer Admin_id) { this.Admin_id = Admin_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdminMiddleNameId other)) return false;
        return java.util.Objects.equals(Sequence_No, other.Sequence_No) && java.util.Objects.equals(Admin_id, other.Admin_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Sequence_No, Admin_id);
    }
}