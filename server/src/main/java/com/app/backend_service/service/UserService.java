package com.app.backend_service.service;

import com.app.backend_service.model.User;
import com.app.backend_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public Optional<User> getByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User create(User user) {
        user.setParola(passwordEncoder.encode(user.getParola()));
        return repository.save(user);
    }

    public Optional<User> login(String email, String parola) {
        Optional<User> userOpt = repository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(parola, user.getParola())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
