package com.example.backend.entity.id;

import java.io.Serializable;

public class AssistantComplaintsId implements Serializable {

    private Integer Complaint_id;

    private Integer Assistant_id;

    public AssistantComplaintsId() {}

    public AssistantComplaintsId(Integer Complaint_id, Integer Assistant_id) {
        this.Complaint_id = Complaint_id;
        this.Assistant_id = Assistant_id;
    }

    public Integer getComplaint_id() { return Complaint_id; }
    public void setComplaint_id(Integer Complaint_id) { this.Complaint_id = Complaint_id; }

    public Integer getAssistant_id() { return Assistant_id; }
    public void setAssistant_id(Integer Assistant_id) { this.Assistant_id = Assistant_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AssistantComplaintsId other)) return false;
        return java.util.Objects.equals(Complaint_id, other.Complaint_id) && java.util.Objects.equals(Assistant_id, other.Assistant_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Complaint_id, Assistant_id);
    }
}