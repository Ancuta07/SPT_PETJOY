package com.app.backend_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tip tip;

    @Column(nullable = false)
    private String oras;

    @Column(nullable = false)
    private String adresa;

    @Column(nullable = false)
    private String telefon;

    @Column(nullable = false)
    private String program;

    @Column(nullable = true)
    private String imageUrl;

    public enum Tip {
        CLINICA,
        CENTRU_ADOPTIE,
        MAGAZIN
    }
}
