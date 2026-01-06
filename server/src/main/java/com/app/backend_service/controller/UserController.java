package com.app.backend_service.controller;

import com.app.backend_service.model.User;
import com.app.backend_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5500") // portul frontend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if(user.getRol() == null){
            user.setRol(User.Role.CLIENT);
        }
        User newUser = userService.register(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.login(request.getEmail(), request.getParola());
        if(userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(401).body("Email sau parola gresita");
        }
    }

    // DTO pentru login
    public static class LoginRequest {
        private String email;
        private String parola;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getParola() { return parola; }
        public void setParola(String parola) { this.parola = parola; }
    }
}
