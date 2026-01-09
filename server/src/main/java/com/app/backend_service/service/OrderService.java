package com.app.backend_service.service;

import com.app.backend_service.model.Order;
import com.app.backend_service.model.OrderItem;
import com.app.backend_service.model.Product;
import com.app.backend_service.repository.OrderRepository;
import com.app.backend_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    //  DTO pentru request-ul de creare comandă 
    public static class CreateOrderRequest {
        public String email;
        public List<Item> items;

        public static class Item {
            public Long productId;
            public Integer quantity;
        }
    }

    public Order createOrder(CreateOrderRequest req) {
        if (req == null || req.email == null || req.email.isBlank())
            throw new RuntimeException("Email lipsă");
        if (req.items == null || req.items.isEmpty())
            throw new RuntimeException("Coș gol");

        Order order = new Order();
        order.setEmail(req.email);
        order.setStatus(Order.Status.PENDING);

        double total = 0;

        for (CreateOrderRequest.Item it : req.items) {
            Product p = productRepo.findById(it.productId)
                    .orElseThrow(() -> new RuntimeException("Produs inexistent: " + it.productId));

            int qty = (it.quantity == null) ? 0 : it.quantity;
            if (qty <= 0) throw new RuntimeException("Cantitate invalidă");
            if (p.getStoc() < qty) throw new RuntimeException("Stoc insuficient pentru " + p.getNume());

            // scade stoc
            p.setStoc(p.getStoc() - qty);
            productRepo.save(p);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(p.getId());
            oi.setProductName(p.getNume());
            oi.setQuantity(qty);
            oi.setUnitPrice(p.getPret());

            order.getItems().add(oi);
            total += p.getPret() * qty;
        }

        order.setTotal(total);
        return orderRepo.save(order);
    }

    public List<Order> getOrdersForUser(String email) {
        return orderRepo.findByEmailOrderByCreatedAtDesc(email);
    }

    public void deleteOrder(Long id, String email) {
        Order o = orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Comanda nu există"));
        if (!o.getEmail().equals(email)) throw new RuntimeException("Nu ai acces la comanda asta");
        orderRepo.deleteById(id);
    }
}
