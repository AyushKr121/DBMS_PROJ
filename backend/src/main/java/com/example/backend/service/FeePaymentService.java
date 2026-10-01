package com.example.backend.service;

import com.example.backend.entity.FeePayment;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.FeePaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeePaymentService {

    private final FeePaymentRepository repository;

    public FeePaymentService(FeePaymentRepository repository) {
        this.repository = repository;
    }

    public List<FeePayment> getAll() {
        return repository.findAll();
    }

    public FeePayment getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee_Payment not found"));
    }

    public FeePayment create(FeePayment entity) {
        return repository.save(entity);
    }

    public FeePayment update(Integer id, FeePayment entity) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Fee_Payment not found");
        }
        entity.setReceipt_id(id);
        return repository.save(entity);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Fee_Payment not found");
        }
        repository.deleteById(id);
    }
}
