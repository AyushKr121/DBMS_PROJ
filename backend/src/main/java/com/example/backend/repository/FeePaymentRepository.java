package com.example.backend.repository;

import com.example.backend.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Integer> {
}
