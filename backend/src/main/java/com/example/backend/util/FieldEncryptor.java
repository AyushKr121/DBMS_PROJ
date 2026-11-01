package com.example.backend.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Converter
public class FieldEncryptor implements AttributeConverter<String, String> {

    private static final String AES = "AES";
    // Must be exactly 32 bytes for AES-256
    private static final String SECRET = "DbmsProjectSecretKey123456789012"; 

    // Static method for manual encryption (used in AuthController)
    public static String encrypt(String attribute) {
        if (attribute == null || attribute.trim().isEmpty()) return attribute;
        try {
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(SECRET.getBytes(), AES));
            return Base64.getEncoder().encodeToString(cipher.doFinal(attribute.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    // Static method for manual decryption (if ever needed)
    public static String decrypt(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) return dbData;
        byte[] encrypted;
        try {
            encrypted = Base64.getDecoder().decode(dbData);
        } catch (IllegalArgumentException e) {
            return dbData;
        }
        if (encrypted.length == 0 || encrypted.length % 16 != 0) return dbData;
        try {
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(SECRET.getBytes(), AES));
            return new String(cipher.doFinal(encrypted));
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    // JPA automated writing
    @Override
    public String convertToDatabaseColumn(String attribute) {
        return encrypt(attribute);
    }

    // JPA automated reading
    @Override
    public String convertToEntityAttribute(String dbData) {
        return decrypt(dbData);
    }
}