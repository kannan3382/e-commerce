package com.aura.ecommerce.controller;

import com.aura.ecommerce.model.Product;
import com.aura.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        if (category != null && !category.equalsIgnoreCase("all")) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        if (brand != null && !brand.equalsIgnoreCase("all")) {
            return productRepository.findByBrandIgnoreCase(brand);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(product.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        Product saved = productRepository.save(product);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updates) {
        return productRepository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getPrice() != null) existing.setPrice(updates.getPrice());
                    if (updates.getStock() != null) existing.setStock(updates.getStock());
                    if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                    if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
                    if (updates.getBrand() != null) existing.setBrand(updates.getBrand());
                    return ResponseEntity.ok(productRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
