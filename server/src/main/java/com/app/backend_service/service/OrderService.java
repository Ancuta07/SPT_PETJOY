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

    @Transactional
    public void delete(Long id) {
        // Găsește comanda
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda cu ID " + id + " nu există"));

        // Parsează produsele și returnează stocul
        String produseJson = order.getProduse();
        if (produseJson != null && !produseJson.isEmpty()) {
            try {
                // Parse manual JSON string
                String[] items = produseJson.substring(1, produseJson.length() - 1).split("\\},\\{");
                
                for (String item : items) {
                    // Extract productId și quantity
                    String cleanItem = item.replace("{", "").replace("}", "");
                    Long productId = null;
                    Integer quantity = null;
                    
                    String[] fields = cleanItem.split(",");
                    for (String field : fields) {
                        String[] keyValue = field.split(":");
                        if (keyValue.length == 2) {
                            String key = keyValue[0].replace("\"", "").trim();
                            String value = keyValue[1].replace("\"", "").trim();
                            
                            if (key.equals("productId")) {
                                productId = Long.parseLong(value);
                            } else if (key.equals("quantity")) {
                                quantity = Integer.parseInt(value);
                            }
                        }
                    }
                    
                    // Actualizează stocul
                    if (productId != null && quantity != null) {
                        Product product = productRepository.findById(productId).orElse(null);
                        if (product != null) {
                            product.setStoc(product.getStoc() + quantity);
                            productRepository.save(product);
                        }
                    }
                }
            } catch (Exception e) {
                // Log error dar continuă cu ștergerea
                System.err.println("Eroare la returnarea stocului: " + e.getMessage());
            }
        }

        // Șterge comanda
        orderRepository.deleteById(id);
    }

    @Transactional
    public Order updateStatus(Long id, Order.Status newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda cu ID " + id + " nu există"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
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
