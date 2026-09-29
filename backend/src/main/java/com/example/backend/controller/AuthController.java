// package com.example.backend.controller;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.dao.EmptyResultDataAccessException;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api")
// public class AuthController {

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     // ==========================================
//     // 1. SIGNUP API
//     // ==========================================
//     @PostMapping("/auth/signup")
//     public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
//         String role = ((String) payload.get("role")).toLowerCase();
//         String firstName = (String) payload.get("first_name");
//         String email = (String) payload.get("email");
//         String credential = (String) payload.get("credential");
//         Integer id = (Integer) payload.get("id"); 

//         String sql = "";
//         try {
//             switch (role) {
//                 case "student":
//                     sql = "INSERT INTO Student (Student_id, First_name, Email, Credential) VALUES (?, ?, ?, ?)";
//                     break;
//                 case "teacher":
//                     sql = "INSERT INTO Teacher (Teacher_id, First_name, Email, Credential, Joining_date) VALUES (?, ?, ?, ?, CURRENT_DATE)";
//                     break;
//                 case "assistant":
//                     sql = "INSERT INTO Assistant (Assistant_id, First_name, Email, Credential) VALUES (?, ?, ?, ?)";
//                     break;
//                 case "admin":
//                     sql = "INSERT INTO Admin (Admin_id, First_name, Email, Credential) VALUES (?, ?, ?, ?)";
//                     break;
//                 default:
//                     return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified"));
//             }

//             jdbcTemplate.update(sql, id, firstName, email, credential);
//             return ResponseEntity.ok(Map.of("message", role.substring(0, 1).toUpperCase() + role.substring(1) + " registered successfully"));
            
//         // } catch (Exception e) {
//         //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//         //             .body(Map.of("error", "Registration failed. Verify constraints (e.g., duplicate ID/Email)."));
//         // }
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                 .body(Map.of("error", "Registration failed", "details", e.getMessage()));
//         }
//     }

//     // ==========================================
//     // 2. LOGIN API
//     // ==========================================
//     @PostMapping("/auth/login")
//     public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
//         String role = credentials.get("role").toLowerCase();
//         String email = credentials.get("email");
//         String password = credentials.get("credential");

//         String tableName = role.substring(0, 1).toUpperCase() + role.substring(1);
//         String idColumn = tableName + "_id";
        
//         String sql = "SELECT " + idColumn + ", Credential FROM " + tableName + " WHERE Email = ?";

//         try {
//             Map<String, Object> user = jdbcTemplate.queryForMap(sql, email);
//             String dbPassword = (String) user.get("Credential");
            
//             if (password.equals(dbPassword)) {
//                 int userId = (Integer) user.get(idColumn);
                
//                 // --- SPRING BOOT BUILT-IN SESSION MANAGEMENT ---
//                 // Get existing session or create a new one
//                 HttpSession session = request.getSession(true);
//                 session.setAttribute("userId", userId);
//                 session.setAttribute("userRole", role);
//                 session.setAttribute("userEmail", email);
                
//                 return ResponseEntity.ok(Map.of(
//                         "message", "Login successful",
//                         "role", role,
//                         "id", userId
//                 ));
//             } else {
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
//             }
//         } catch (EmptyResultDataAccessException e) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
//         }
//     }

//     // ==========================================
//     // 3. LOGOUT API
//     // ==========================================
//     @PostMapping("/auth/logout")
//     public ResponseEntity<?> logout(HttpServletRequest request) {
//         HttpSession session = request.getSession(false);
//         if (session != null) {
//             session.invalidate(); // Destroy the session entirely
//         }
//         return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//     }

//     // ==========================================
//     // 4. DELETE ACCOUNT API (Protected Route)
//     // ==========================================
//     @DeleteMapping("/protected/account")
//     public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
//         HttpSession session = request.getSession(false);
        
//         // Retrieve data safely stored in the server-side session
//         String userRole = (String) session.getAttribute("userRole");
//         Integer userId = (Integer) session.getAttribute("userId");

//         String tableName = userRole.substring(0, 1).toUpperCase() + userRole.substring(1);
//         String idColumn = tableName + "_id";
        
//         String sql = "DELETE FROM " + tableName + " WHERE " + idColumn + " = ?";

//         int rowsAffected = jdbcTemplate.update(sql, userId);

//         if (rowsAffected > 0) {
//             session.invalidate(); // Log the user out after deleting account
//             return ResponseEntity.ok(Map.of("message", "Account successfully deleted"));
//         } else {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Failed to delete account"));
//         }
//     }
// }





package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==========================================
    // 1. SIGNUP API (Refactored for Schema Safety)
    // ==========================================
    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("role") || payload.get("role") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role is required"));
        }
        
        String role = ((String) payload.get("role")).toLowerCase();
        
        // Required Fields
        String firstName = (String) payload.get("first_name");
        String email = (String) payload.get("email");
        String credential = (String) payload.get("credential");
        
        if (firstName == null || email == null || credential == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields: first_name, email, or credential"));
        }

        // Optional Fields (Safe extraction to avoid FK constraints on empty strings)
        String lastName = getNullIfBlank(payload, "last_name");
        String sex = getNullIfBlank(payload, "sex");
        String pincode = getNullIfBlank(payload, "pincode");
        String aadharId = getNullIfBlank(payload, "aadhar_id");
        
        String dobStr = getNullIfBlank(payload, "dob");
        Date dob = (dobStr != null) ? Date.valueOf(dobStr) : null;

        try {
            int newId;
            String sql = "";

            switch (role) {
                case "student":
                    newId = generateNextId("Student", "Student_id", payload.get("id"));
                    sql = "INSERT INTO Student (Student_id, First_name, Last_name, Sex, DOB, Email, Credential, Pincode, Aadhar_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    jdbcTemplate.update(sql, newId, firstName, lastName, sex, dob, email, credential, pincode, aadharId);
                    break;
                    
                case "teacher":
                    newId = generateNextId("Teacher", "Teacher_id", payload.get("id"));
                    sql = "INSERT INTO Teacher (Teacher_id, First_name, Last_name, Sex, DOB, Email, Credential, Pincode, Aadhar_id, Joining_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)";
                    jdbcTemplate.update(sql, newId, firstName, lastName, sex, dob, email, credential, pincode, aadharId);
                    break;
                    
                case "assistant":
                    newId = generateNextId("Assistant", "Assistant_id", payload.get("id"));
                    sql = "INSERT INTO Assistant (Assistant_id, First_name, Last_name, Sex, DOB, Email, Credential, Pincode, Aadhar_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    jdbcTemplate.update(sql, newId, firstName, lastName, sex, dob, email, credential, pincode, aadharId);
                    break;
                    
                case "admin":
                    newId = generateNextId("Admin", "Admin_id", payload.get("id"));
                    sql = "INSERT INTO Admin (Admin_id, First_name, Last_name, Sex, DOB, Email, Credential, Pincode, Aadhar_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    jdbcTemplate.update(sql, newId, firstName, lastName, sex, dob, email, credential, pincode, aadharId);
                    break;
                    
                default:
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified"));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", role.substring(0, 1).toUpperCase() + role.substring(1) + " registered successfully",
                    "id", newId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Registration failed", "details", e.getMessage()));
        }
    }

    // ==========================================
    // Helper Methods for Signup
    // ==========================================
    
    // Auto-generates the next ID if the frontend doesn't provide one
    private int generateNextId(String tableName, String idColumn, Object providedId) {
        if (providedId != null) {
            if (providedId instanceof Integer) return (Integer) providedId;
            try { return Integer.parseInt(providedId.toString()); } catch (NumberFormatException ignored) {}
        }
        String sql = "SELECT COALESCE(MAX(" + idColumn + "), 0) + 1 FROM " + tableName;
        Integer nextId = jdbcTemplate.queryForObject(sql, Integer.class);
        return (nextId != null) ? nextId : 1;
    }

    // Prevents sending empty strings ("") to Foreign Key columns like Pincode, which crashes SQL
    private String getNullIfBlank(Map<String, Object> payload, String key) {
        Object val = payload.get(key);
        if (val == null) return null;
        String str = val.toString().trim();
        return str.isEmpty() ? null : str;
    }

    // ==========================================
    // 2. LOGIN API (Untouched)
    // ==========================================
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String role = credentials.get("role").toLowerCase();
        String email = credentials.get("email");
        String password = credentials.get("credential");

        String tableName = role.substring(0, 1).toUpperCase() + role.substring(1);
        String idColumn = tableName + "_id";
        
        String sql = "SELECT " + idColumn + ", Credential FROM " + tableName + " WHERE Email = ?";

        try {
            Map<String, Object> user = jdbcTemplate.queryForMap(sql, email);
            String dbPassword = (String) user.get("Credential");
            
            if (password.equals(dbPassword)) {
                int userId = (Integer) user.get(idColumn);
                
                // --- SPRING BOOT BUILT-IN SESSION MANAGEMENT ---
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", userId);
                session.setAttribute("userRole", role);
                session.setAttribute("userEmail", email);
                
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "role", role,
                        "id", userId
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
            }
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
    }

    // ==========================================
    // 3. LOGOUT API (Untouched)
    // ==========================================
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // Destroy the session entirely
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // ==========================================
    // 4. DELETE ACCOUNT API (Protected Route) (Untouched)
    // ==========================================
    @DeleteMapping("/protected/account")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        
        // Retrieve data safely stored in the server-side session
        String userRole = (String) session.getAttribute("userRole");
        Integer userId = (Integer) session.getAttribute("userId");

        String tableName = userRole.substring(0, 1).toUpperCase() + userRole.substring(1);
        String idColumn = tableName + "_id";
        
        String sql = "DELETE FROM " + tableName + " WHERE " + idColumn + " = ?";

        int rowsAffected = jdbcTemplate.update(sql, userId);

        if (rowsAffected > 0) {
            session.invalidate(); // Log the user out after deleting account
            return ResponseEntity.ok(Map.of("message", "Account successfully deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Failed to delete account"));
        }
    }
}