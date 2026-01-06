package com.app.backend_service.service;

import com.app.backend_service.model.User;
import com.app.backend_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Înregistrare user
    public User register(User user) {
        user.setParola(passwordEncoder.encode(user.getParola()));
        return userRepository.save(user);
    }

    // Login user
    public Optional<User> login(String email, String parola) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isPresent()) {
            User user = userOpt.get();
            if(passwordEncoder.matches(parola, user.getParola())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}
