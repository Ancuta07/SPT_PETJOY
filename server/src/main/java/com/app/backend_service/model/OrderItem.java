package com.app.backend_service.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name="order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    @JoinColumn(name="order_id")
    @JsonBackReference
    private Order order;

    @Column(nullable=false)
    private Long productId;

    @Column(nullable=false)
    private String productName;

    @Column(nullable=false)
    private Integer quantity;

    @Column(nullable=false)
    private Double unitPrice;
}
