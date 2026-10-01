package com.example.backend.entity.id;

import java.io.Serializable;

public class AdminContactsId implements Serializable {

    private Integer Admin_id;

    private String Phone_no;

    public AdminContactsId() {}

    public AdminContactsId(Integer Admin_id, String Phone_no) {
        this.Admin_id = Admin_id;
        this.Phone_no = Phone_no;
    }

    public Integer getAdmin_id() { return Admin_id; }
    public void setAdmin_id(Integer Admin_id) { this.Admin_id = Admin_id; }

    public String getPhone_no() { return Phone_no; }
    public void setPhone_no(String Phone_no) { this.Phone_no = Phone_no; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdminContactsId other)) return false;
        return java.util.Objects.equals(Admin_id, other.Admin_id) && java.util.Objects.equals(Phone_no, other.Phone_no);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(Admin_id, Phone_no);
    }
}