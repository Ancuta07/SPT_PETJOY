package com.app.backend_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nume;

    @Column(nullable = false, unique = true)
    private String email; 

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String parola; // criptata

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role rol;

    public enum Role {
        CLIENT,
        ADMIN
    }
}
