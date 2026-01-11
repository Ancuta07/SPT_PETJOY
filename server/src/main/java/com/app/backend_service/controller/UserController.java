package com.app.backend_service.controller;

import com.app.backend_service.model.User;
import com.app.backend_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5500")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (service.getByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email-ul este deja înregistrat");
        }
        
        if (user.getRol() == null) {
            user.setRol(User.Role.CLIENT);
        }
        User newUser = service.create(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = service.login(request.getEmail(), request.getParola());
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(401).body("Email sau parola gresita");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la ștergere: " + e.getMessage());
        }
    }

    public static class LoginRequest {
        private String email;
        private String parola;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getParola() { return parola; }
        public void setParola(String parola) { this.parola = parola; }
    }
}
