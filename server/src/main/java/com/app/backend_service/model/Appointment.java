package com.app.backend_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nume;

    @Column(nullable = false)
    private String prenume;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefon;

    @Column(nullable = false)
    private String clinica;

    @Column(nullable = false)
    private String oras;

    @Column(nullable = false)
    private LocalDateTime dataOra;

    @Column(nullable = false)
    private LocalDateTime dataCreare;

    @PrePersist
    protected void onCreate() {
        dataCreare = LocalDateTime.now();
    }
}
