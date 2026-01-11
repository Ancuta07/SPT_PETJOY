package com.app.backend_service.service;

import com.app.backend_service.model.Product;
import com.app.backend_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAll() {
        return repository.findAll();
    }

    public List<Product> getByCategorie(String categorie) {
        return repository.findByCategorie(categorie);
    }

    public Product create(Product product) {
        if (product.getStoc() == null) {
            product.setStoc(0);
        }
        return repository.save(product);
    }

    public Product update(Product product) {
        Product existing = repository.findById(product.getId())
            .orElseThrow(() -> new RuntimeException("Produs nu există"));
        
        if (product.getStoc() != null) {
            existing.setStoc(product.getStoc());
        }
        if (product.getNume() != null) {
            existing.setNume(product.getNume());
        }
        if (product.getPret() != null) {
            existing.setPret(product.getPret());
        }
        if (product.getCategorie() != null) {
            existing.setCategorie(product.getCategorie());
        }
        if (product.getDescriere() != null) {
            existing.setDescriere(product.getDescriere());
        }
        if (product.getImageUrl() != null) {
            existing.setImageUrl(product.getImageUrl());
        }
        
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
