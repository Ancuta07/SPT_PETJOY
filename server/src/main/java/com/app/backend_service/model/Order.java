package com.app.backend_service.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"parola", "appointments", "orders"})
    private User user;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String produse; 

    @Column(nullable = false)
    private String adresaLivrare;

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(nullable = false)
    private LocalDate createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDate.now();
        if (status == null) status = Status.PENDING;
    }

    public enum Status {
        PENDING, IN_PROCESS, ON_THE_WAY, DELIVERED
    }
}
