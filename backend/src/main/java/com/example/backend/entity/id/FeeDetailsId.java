package com.example.backend.entity.id;

import java.io.Serializable;

public class FeeDetailsId implements Serializable {

    private Integer Receipt_id;

    private String Description;

    public FeeDetailsId() {}

    public FeeDetailsId(Integer Receipt_id, String Description) {
        this.Receipt_id = Receipt_id;
        this.Description = Description;
    }

    public Integer getReceipt_id() { return Receipt_id; }
    public void setReceipt_id(Integer Receipt_id) { this.Receipt_id = Receipt_id; }

    public String getDescription() { return Description; }
    public void setDescription(String Description) { this.Description = Description; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FeeDetailsId other)) return false;
        return java.util.Objects.equals(Receipt_id, other.Receipt_id) && java.util.Objects.equals(Description, other.Description);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Receipt_id, Description);
    }
}