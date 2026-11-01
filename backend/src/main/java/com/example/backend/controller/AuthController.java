package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.util.FieldEncryptor; // Added FieldEncryptor import

import java.sql.Date;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Inject the PasswordEncoder configured in SecurityConfig
    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==========================================
    // 1. SIGNUP API
    // ==========================================

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(
            @RequestBody Map<String, Object> payload) {

        if (payload.get("role") == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Role is required"));
        }

        String role = payload.get("role").toString().toLowerCase();

        String firstName = (String) payload.get("first_name");
        String email = (String) payload.get("email");
        String credential = (String) payload.get("credential");

        if (firstName == null || firstName.isBlank()
                || email == null || email.isBlank()
                || credential == null || credential.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error",
                            "Missing required fields: first_name, email, or credential")
            );
        }

        // Hash the credential before storing it in the database
        String hashedCredential = passwordEncoder.encode(credential);

        String lastName = getNullIfBlank(payload, "last_name");
        String sex = getNullIfBlank(payload, "sex");
        String pincode = getNullIfBlank(payload, "pincode");
        
        // Extract the plain text Aadhar ID and manually encrypt it
        String plainAadharId = getNullIfBlank(payload, "aadhar_id");
        String encryptedAadharId = FieldEncryptor.encrypt(plainAadharId);

        String dobStr = getNullIfBlank(payload, "dob");

        try {
            Date dob = dobStr != null ? Date.valueOf(dobStr) : null;

            int newId;
            String sql;

            switch (role) {
                case "student":
                    newId = generateNextId(
                            "Student", "Student_id", payload.get("id"));

                    sql = """
                            INSERT INTO Student
                            (Student_id, First_name, Last_name, Sex,
                             DOB, Email, Credential, Pincode, Aadhar_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """;

                    // Insert using the encryptedAadharId
                    jdbcTemplate.update(
                            sql, newId, firstName, lastName, sex,
                            dob, email, hashedCredential, pincode, encryptedAadharId
                    );
                    break;

                case "teacher":
                    newId = generateNextId(
                            "Teacher", "Teacher_id", payload.get("id"));

                    sql = """
                            INSERT INTO Teacher
                            (Teacher_id, First_name, Last_name, Sex,
                             DOB, Email, Credential, Pincode,
                             Aadhar_id, Joining_date)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)
                            """;

                    // Insert using the encryptedAadharId
                    jdbcTemplate.update(
                            sql, newId, firstName, lastName, sex,
                            dob, email, hashedCredential, pincode, encryptedAadharId
                    );
                    break;

                case "assistant":
                    newId = generateNextId(
                            "Assistant", "Assistant_id", payload.get("id"));

                    sql = """
                            INSERT INTO Assistant
                            (Assistant_id, First_name, Last_name, Sex,
                             DOB, Email, Credential, Pincode, Aadhar_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """;

                    // Insert using the encryptedAadharId
                    jdbcTemplate.update(
                            sql, newId, firstName, lastName, sex,
                            dob, email, hashedCredential, pincode, encryptedAadharId
                    );
                    break;

                case "admin":
                    newId = generateNextId(
                            "Admin", "Admin_id", payload.get("id"));

                    sql = """
                            INSERT INTO Admin
                            (Admin_id, First_name, Last_name, Sex,
                             DOB, Email, Credential, Pincode, Aadhar_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """;

                    // Insert using the encryptedAadharId
                    jdbcTemplate.update(
                            sql, newId, firstName, lastName, sex,
                            dob, email, hashedCredential, pincode, encryptedAadharId
                    );
                    break;

                default:
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Invalid role specified"));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", role.substring(0, 1).toUpperCase()
                                    + role.substring(1)
                                    + " registered successfully",
                            "id", newId
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid date format. Use yyyy-MM-dd"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Registration failed",
                            "details", e.getMessage()
                    ));
        }
    }

    // ==========================================
    // 2. LOGIN API
    // ==========================================

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request) {

        String role = credentials.get("role");
        String email = credentials.get("email");
        String password = credentials.get("credential");

        if (role == null || email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Role, email and credential are required"));
        }

        role = role.toLowerCase();

        // Only allow known roles to prevent SQL identifier injection.
        String tableName;
        String idColumn;

        switch (role) {
            case "student":
                tableName = "Student";
                idColumn = "Student_id";
                break;
            case "teacher":
                tableName = "Teacher";
                idColumn = "Teacher_id";
                break;
            case "assistant":
                tableName = "Assistant";
                idColumn = "Assistant_id";
                break;
            case "admin":
                tableName = "Admin";
                idColumn = "Admin_id";
                break;
            default:
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid role specified"));
        }

        String sql = "SELECT " + idColumn
                + ", Credential FROM " + tableName
                + " WHERE Email = ?";

        try {
            Map<String, Object> user =
                    jdbcTemplate.queryForMap(sql, email);

            String dbPassword = (String) user.get("Credential");

            // Securely compare the incoming password with the database hash
            if (dbPassword == null || !passwordEncoder.matches(password, dbPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }

            int userId = ((Number) user.get(idColumn)).intValue();

            // Invalidate any existing session to prevent session fixation.
            HttpSession existingSession = request.getSession(false);

            if (existingSession != null) {
                existingSession.invalidate();
            }

            // Create a fresh session after successful authentication.
            HttpSession session = request.getSession(true);

            session.setAttribute("userId", userId);
            session.setAttribute("userRole", role);
            session.setAttribute("userEmail", email);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful",
                            "role", role,
                            "id", userId
                    )
            );

        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }

    // ==========================================
    // 3. CURRENT USER / SESSION RESTORATION
    // ==========================================

    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Not authenticated"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "id", session.getAttribute("userId"),
                        "role", session.getAttribute("userRole"),
                        "email", session.getAttribute("userEmail")
                )
        );
    }

    // ==========================================
    // 4. LOGOUT API
    // ==========================================

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    // ==========================================
    // 5. DELETE ACCOUNT API
    // ==========================================

    @DeleteMapping("/protected/account")
    public ResponseEntity<?> deleteAccount(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String userRole = (String) session.getAttribute("userRole");
        Integer userId = (Integer) session.getAttribute("userId");

        if (userRole == null || userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid session"));
        }

        String tableName;
        String idColumn;

        switch (userRole.toLowerCase()) {
            case "student":
                tableName = "Student";
                idColumn = "Student_id";
                break;
            case "teacher":
                tableName = "Teacher";
                idColumn = "Teacher_id";
                break;
            case "assistant":
                tableName = "Assistant";
                idColumn = "Assistant_id";
                break;
            case "admin":
                tableName = "Admin";
                idColumn = "Admin_id";
                break;
            default:
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid role"));
        }

        String sql = "DELETE FROM " + tableName
                + " WHERE " + idColumn + " = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, userId);

            if (rowsAffected > 0) {
                session.invalidate();

                return ResponseEntity.ok(
                        Map.of("message", "Account successfully deleted")
                );
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to delete account"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Account deletion failed",
                            "details", e.getMessage()
                    ));
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private int generateNextId(
            String tableName,
            String idColumn,
            Object providedId) {

        if (providedId != null) {
            if (providedId instanceof Number) {
                return ((Number) providedId).intValue();
            }

            try {
                return Integer.parseInt(providedId.toString());
            } catch (NumberFormatException ignored) {
                throw new IllegalArgumentException("Invalid ID");
            }
        }

        String sql = "SELECT COALESCE(MAX(" + idColumn
                + "), 0) + 1 FROM " + tableName;

        Integer nextId = jdbcTemplate.queryForObject(sql, Integer.class);

        return nextId != null ? nextId : 1;
    }

    private String getNullIfBlank(
            Map<String, Object> payload,
            String key) {

        Object value = payload.get(key);

        if (value == null) {
            return null;
        }

        String str = value.toString().trim();

        return str.isEmpty() ? null : str;
    }
}