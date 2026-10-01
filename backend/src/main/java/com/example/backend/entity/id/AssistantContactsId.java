package com.example.backend.entity.id;

import java.io.Serializable;

public class AssistantContactsId implements Serializable {

    private Integer Assistant_id;

    private String Phone_no;

    public AssistantContactsId() {}

    public AssistantContactsId(Integer Assistant_id, String Phone_no) {
        this.Assistant_id = Assistant_id;
        this.Phone_no = Phone_no;
    }

    public Integer getAssistant_id() { return Assistant_id; }
    public void setAssistant_id(Integer Assistant_id) { this.Assistant_id = Assistant_id; }

    public String getPhone_no() { return Phone_no; }
    public void setPhone_no(String Phone_no) { this.Phone_no = Phone_no; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AssistantContactsId other)) return false;
        return java.util.Objects.equals(Assistant_id, other.Assistant_id) && java.util.Objects.equals(Phone_no, other.Phone_no);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Assistant_id, Phone_no);
    }
}