package com.example.backend.repository;

import com.example.backend.entity.Takes;
import com.example.backend.entity.id.TakesId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TakesRepository extends JpaRepository<Takes, TakesId> {
}
