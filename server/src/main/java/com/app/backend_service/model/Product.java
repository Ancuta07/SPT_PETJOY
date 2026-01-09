package com.app.backend_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String nume;

    @Column(length = 1000)
    private String descriere;

    @Column(nullable=false)
    private Double pret;

    @Column(nullable=false)
    private Integer stoc;

    @Column(nullable=false)
    private String categorie;

    private String imageUrl;
}
