package com.example.backend.entity.id;

import java.io.Serializable;

public class AssistantMiddleNameId implements Serializable {

    private Integer Sequence_No;

    private Integer Assistant_id;

    public AssistantMiddleNameId() {}

    public AssistantMiddleNameId(Integer Sequence_No, Integer Assistant_id) {
        this.Sequence_No = Sequence_No;
        this.Assistant_id = Assistant_id;
    }

    public Integer getSequence_No() { return Sequence_No; }
    public void setSequence_No(Integer Sequence_No) { this.Sequence_No = Sequence_No; }

    public Integer getAssistant_id() { return Assistant_id; }
    public void setAssistant_id(Integer Assistant_id) { this.Assistant_id = Assistant_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AssistantMiddleNameId other)) return false;
        return java.util.Objects.equals(Sequence_No, other.Sequence_No) && java.util.Objects.equals(Assistant_id, other.Assistant_id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Sequence_No, Assistant_id);
    }
}