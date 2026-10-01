package com.example.backend.repository;

import com.example.backend.entity.Pincode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PincodeRepository extends JpaRepository<Pincode, String> {
}
