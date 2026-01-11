package com.app.backend_service.config;

import com.app.backend_service.model.User;
import com.app.backend_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Verifică dacă există deja un user admin
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .nume("admin")
                    .email("admin@gmail.com")
                    .parola(passwordEncoder.encode("Admin123!"))
                    .rol(User.Role.ADMIN)
                    .build();
            
            userRepository.save(admin);
            System.out.println("✓ User admin default creat cu succes: admin@gmail.com");
        } else {
            System.out.println("✓ User admin deja există în baza de date");
        }
    }
}
