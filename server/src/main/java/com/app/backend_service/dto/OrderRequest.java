package com.app.backend_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String email;
    private String adresaLivrare;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
