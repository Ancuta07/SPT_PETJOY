package com.app.backend_service.service;

import com.app.backend_service.model.Product;
import com.app.backend_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    public List<Product> getByCategorie(String categorie) {
        return repo.findByCategorie(categorie);
    }

    public Product create(Product p) {
        if (p.getStoc() == null) p.setStoc(0);
        return repo.save(p);
    }
}
