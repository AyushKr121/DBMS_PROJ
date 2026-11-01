package com.example.backend.config;

import com.example.backend.middleware.AuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow credentials requires explicit origin patterns rather than a broad "*" in some older Spring versions, 
        // but allowedOriginPatterns("*") works for Spring Boot 2.4+
        registry.addMapping("/**")
                .allowedOriginPatterns("*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Re-enabled interceptor to protect the dashboard and API routes
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/protected/**")
                .excludePathPatterns("/api/auth/**");
    }

    // Explicitly configure the session cookie for HTTPS and cross-origin requests
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("SESSION"); 
        serializer.setCookiePath("/");
        serializer.setUseSecureCookie(true); // Enforces HTTPS
        serializer.setSameSite("None");      // Allows cross-origin cookie sharing
        return serializer;
    }
}



// // package com.example.backend.config;

// // import com.example.backend.middleware.AuthInterceptor;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.context.annotation.Configuration;
// // import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// // import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// // @Configuration
// // public class WebConfig implements WebMvcConfigurer {

// //     @Autowired
// //     private AuthInterceptor authInterceptor;

// //     @Override
// //     public void addInterceptors(InterceptorRegistry registry) {
// //         // Protect specific paths, exclude authentication paths
// //         registry.addInterceptor(authInterceptor)
// //                 .addPathPatterns("/api/protected/**")
// //                 .excludePathPatterns("/api/auth/**"); 
// //     }
// // }


// package com.example.backend.config;

// import com.example.backend.middleware.AuthInterceptor;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Autowired
//     private AuthInterceptor authInterceptor;

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         // Allow all endpoints, origins, headers, and HTTP methods for testing
//         registry.addMapping("/**")
//                 .allowedOriginPatterns("*")
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                 .allowedHeaders("*")
//                 .allowCredentials(true);
//     }

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         // Commented out to bypass authentication checks during testing
//         /*
//         registry.addInterceptor(authInterceptor)
//                 .addPathPatterns("/api/protected/**")
//                 .excludePathPatterns("/api/auth/**");
//         */
//     }
// }