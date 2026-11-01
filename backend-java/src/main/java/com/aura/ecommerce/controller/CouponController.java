package com.aura.ecommerce.controller;

import com.aura.ecommerce.model.Coupon;
import com.aura.ecommerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Number subtotalNum = (Number) payload.get("subtotal");

        if (code == null || subtotalNum == null) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Missing code or subtotal"));
        }

        BigDecimal subtotal = BigDecimal.valueOf(subtotalNum.doubleValue());
        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code.trim());

        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid or expired promo code"));
        }

        Coupon c = opt.get();
        if (subtotal.compareTo(c.getMinSpend()) < 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Minimum spend requirement is $" + c.getMinSpend()
            ));
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", c.getCode(),
                "discountPercent", c.getDiscountPercent()
        ));
    }
}
