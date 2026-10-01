// package com.example.backend.config;

// import com.example.backend.middleware.AuthInterceptor;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Autowired
//     private AuthInterceptor authInterceptor;

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         // Protect specific paths, exclude authentication paths
//         registry.addInterceptor(authInterceptor)
//                 .addPathPatterns("/api/protected/**")
//                 .excludePathPatterns("/api/auth/**"); 
//     }
// }


package com.example.backend.config;

import com.example.backend.middleware.AuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow all endpoints, origins, headers, and HTTP methods for testing
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Commented out to bypass authentication checks during testing
        /*
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/protected/**")
                .excludePathPatterns("/api/auth/**");
        */
    }
}