package com.example.backend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FieldEncryptorTest {

    @Test
    void readsLegacyPlaintextAadhaar() {
        assertEquals("123456789012", FieldEncryptor.decrypt("123456789012"));
    }

    @Test
    void readsLegacyFormattedAadhaar() {
        assertEquals("1234 5678 9012", FieldEncryptor.decrypt("1234 5678 9012"));
    }

    @Test
    void decryptsEncryptedAadhaar() {
        String aadhaar = "123456789012";
        assertEquals(aadhaar, FieldEncryptor.decrypt(FieldEncryptor.encrypt(aadhaar)));
    }
}