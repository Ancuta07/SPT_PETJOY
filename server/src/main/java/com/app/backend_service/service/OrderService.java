package com.app.backend_service.service;

import com.app.backend_service.dto.OrderRequest;
import com.app.backend_service.model.Order;
import com.app.backend_service.model.Product;
import com.app.backend_service.model.User;
import com.app.backend_service.repository.OrderRepository;
import com.app.backend_service.repository.ProductRepository;
import com.app.backend_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, 
                       ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public List<Order> getByEmail(String email) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        // 1. Găsește utilizatorul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există"));

        // 2. Construiește JSON manual și calculează totalul
        StringBuilder produseJson = new StringBuilder("[");
        double total = 0.0;
        boolean first = true;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produsul cu ID " + itemRequest.getProductId() + " nu există"));

            // Verifică stocul
            if (product.getStoc() < itemRequest.getQuantity()) {
                throw new RuntimeException("Stoc insuficient pentru produsul: " + product.getNume());
            }

            // Actualizează stocul
            product.setStoc(product.getStoc() - itemRequest.getQuantity());
            productRepository.save(product);

            // Construiește JSON manual
            if (!first) {
                produseJson.append(",");
            }
            first = false;

            produseJson.append("{")
                    .append("\"productId\":").append(product.getId()).append(",")
                    .append("\"productName\":\"").append(escapeJson(product.getNume())).append("\",")
                    .append("\"quantity\":").append(itemRequest.getQuantity()).append(",")
                    .append("\"priceAtOrder\":").append(product.getPret())
                    .append("}");

            total += product.getPret() * itemRequest.getQuantity();
        }
        produseJson.append("]");

        // 3. Creează comanda
        Order order = Order.builder()
                .user(user)
                .email(user.getEmail())
                .produse(produseJson.toString())
                .adresaLivrare(request.getAdresaLivrare())
                .total(total)
                .status(Order.Status.PENDING)
                .build();

        return orderRepository.save(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}
