package com.example.backend.entity.id;

import java.io.Serializable;

public class ScheduleId implements Serializable {

    private String Day;

    private Integer Batch_id;

    public ScheduleId() {}

    public ScheduleId(String Day, Integer Batch_id) {
        this.Day = Day;
        this.Batch_id = Batch_id;
    }

    public String getDay() { return Day; }
    public void setDay(String Day) { this.Day = Day; }

    public Integer getBatch_id() { return Batch_id; }
    public void setBatch_id(Integer Batch_id) { this.Batch_id = Batch_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ScheduleId other)) return false;
        return java.util.Objects.equals(Day, other.Day) && java.util.Objects.equals(Batch_id, other.Batch_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Day, Batch_id);
    }
}