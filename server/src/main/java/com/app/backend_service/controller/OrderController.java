package com.app.backend_service.controller;

import com.app.backend_service.model.Order;
import com.app.backend_service.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5500")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderService.CreateOrderRequest req) {
        return ResponseEntity.ok(service.createOrder(req));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Order>> getByUser(@PathVariable String email) {
        return ResponseEntity.ok(service.getOrdersForUser(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam String email) {
        service.deleteOrder(id, email);
        return ResponseEntity.ok().build();
    }
}
