package com.app.backend_service.controller;

import com.app.backend_service.model.Product;
import com.app.backend_service.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5500")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll(@RequestParam(required = false) String categorie) {
        if (categorie != null && !categorie.isBlank()) {
            return ResponseEntity.ok(service.getByCategorie(categorie));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product p) {
        return ResponseEntity.ok(service.create(p));
    }
}
