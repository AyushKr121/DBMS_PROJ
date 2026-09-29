    package com.example.backend.controller;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.jdbc.core.JdbcTemplate;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    import java.util.List;
    import java.util.Map;

    @RestController
    public class DatabaseTestController {

        @Autowired
        private JdbcTemplate jdbcTemplate;

        // This creates a raw data endpoint at http://localhost:8080/api/test-query
        @GetMapping("/api/test-query")
        public List<Map<String, Object>> getTestData() {
            // Replace this with any SELECT query you want to test
            String sql = "Select Count(*) FROM Student"; 
            
            // Executes the query and maps the result to a JSON-friendly format
            return jdbcTemplate.queryForList(sql);
        }
    }