package com.aura.ecommerce;

import com.aura.ecommerce.model.Product;
import com.aura.ecommerce.model.Coupon;
import com.aura.ecommerce.repository.ProductRepository;
import com.aura.ecommerce.repository.CouponRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class AuraEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuraEcommerceApplication.class, args);
        System.out.println("==================================================");
        System.out.println("   AURA E-Commerce Java Spring Boot Backend       ");
        System.out.println("   Running at: http://localhost:8080             ");
        System.out.println("   API Docs:   http://localhost:8080/api/products ");
        System.out.println("==================================================");
    }

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepo, CouponRepository couponRepo) {
        return args -> {
            if (productRepo.count() == 0) {
                Product p1 = new Product();
                p1.setName("AURA Pulse Pro Wireless Studio Headphones");
                p1.setSlug("aura-pulse-pro-wireless-headphones");
                p1.setBrand("AURA Labs");
                p1.setCategory("Audio & Acoustics");
                p1.setPrice(new BigDecimal("349.00"));
                p1.setOriginalPrice(new BigDecimal("399.00"));
                p1.setStock(24);
                p1.setRating(4.9);
                p1.setReviewCount(128);
                p1.setDescription("Crafted with custom 40mm bio-cellulose drivers, active spatial acoustic cancellation, and 45 hours playback.");
                p1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80");
                p1.setIsFeatured(true);
                p1.setIsBestSeller(true);

                Product p2 = new Product();
                p2.setName("Chronos Sapphire Titanium Smartwatch");
                p2.setSlug("chronos-sapphire-titanium-smartwatch");
                p2.setBrand("Chronos");
                p2.setCategory("Wearables & Watches");
                p2.setPrice(new BigDecimal("499.00"));
                p2.setOriginalPrice(new BigDecimal("549.00"));
                p2.setStock(18);
                p2.setRating(4.8);
                p2.setReviewCount(84);
                p2.setDescription("Aerospace Grade 5 titanium chassis paired with an ultra-bright sapphire crystal AMOLED display.");
                p2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80");
                p2.setIsFeatured(true);
                p2.setIsBestSeller(true);

                Product p3 = new Product();
                p3.setName("Keychron Lumina Walnut Mechanical Keyboard");
                p3.setSlug("keychron-lumina-walnut-keyboard");
                p3.setBrand("Lumina Studio");
                p3.setCategory("Workspace & Desk");
                p3.setPrice(new BigDecimal("189.00"));
                p3.setOriginalPrice(new BigDecimal("220.00"));
                p3.setStock(31);
                p3.setRating(4.9);
                p3.setReviewCount(95);
                p3.setDescription("Solid American black walnut body with hot-swappable tactile Gateron Oil King switches.");
                p3.setImageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80");
                p3.setIsFeatured(true);
                p3.setIsBestSeller(false);

                productRepo.saveAll(List.of(p1, p2, p3));
                System.out.println("Seeded initial product catalog into database.");
            }

            if (couponRepo.count() == 0) {
                Coupon c1 = new Coupon();
                c1.setCode("SAVE20");
                c1.setDiscountPercent(20);
                c1.setMinSpend(new BigDecimal("200.00"));
                c1.setDescription("20% off high-tier orders over $200");
                c1.setExpiresAt(LocalDate.of(2026, 12, 31));
                c1.setIsActive(true);

                Coupon c2 = new Coupon();
                c2.setCode("WELCOME10");
                c2.setDiscountPercent(10);
                c2.setMinSpend(new BigDecimal("50.00"));
                c2.setDescription("10% off your entire order");
                c2.setExpiresAt(LocalDate.of(2026, 12, 31));
                c2.setIsActive(true);

                couponRepo.saveAll(List.of(c1, c2));
                System.out.println("Seeded active discount coupons into database.");
            }
        };
    }
}
