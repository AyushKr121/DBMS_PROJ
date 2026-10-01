package com.example.backend.repository;

import com.example.backend.entity.FeeDetails;
import com.example.backend.entity.id.FeeDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeDetailsRepository extends JpaRepository<FeeDetails, FeeDetailsId> {
}
