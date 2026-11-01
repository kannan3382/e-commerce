package com.aura.ecommerce.controller;

import com.aura.ecommerce.dto.CheckoutRequest;
import com.aura.ecommerce.model.Coupon;
import com.aura.ecommerce.model.Order;
import com.aura.ecommerce.model.OrderItem;
import com.aura.ecommerce.model.Product;
import com.aura.ecommerce.repository.CouponRepository;
import com.aura.ecommerce.repository.OrderRepository;
import com.aura.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> placeOrder(@RequestBody CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No items provided in cart"));
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 1. Verify pricing & deduct stock
        for (CheckoutRequest.ItemDto itemDto : request.getItems()) {
            Optional<Product> prodOpt = productRepository.findById(itemDto.getProductId());
            if (prodOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product not found: " + itemDto.getName()));
            }

            Product prod = prodOpt.get();
            if (prod.getStock() < itemDto.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Insufficient inventory for " + prod.getName()));
            }

            // Deduct stock
            prod.setStock(prod.getStock() - itemDto.getQuantity());
            productRepository.save(prod);

            BigDecimal lineTotal = prod.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(prod.getId());
            orderItem.setName(prod.getName());
            orderItem.setPrice(prod.getPrice());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setImage(prod.getImageUrl());
            orderItems.add(orderItem);
        }

        // 2. Validate Coupon
        BigDecimal discount = BigDecimal.ZERO;
        String appliedCouponCode = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(request.getCouponCode());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                if (subtotal.compareTo(coupon.getMinSpend()) >= 0) {
                    discount = subtotal.multiply(BigDecimal.valueOf(coupon.getDiscountPercent()))
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    appliedCouponCode = coupon.getCode();
                }
            }
        }

        BigDecimal taxableAmount = subtotal.subtract(discount);
        BigDecimal tax = taxableAmount.multiply(new BigDecimal("0.0825")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shipping = request.getShippingCost() != null ? request.getShippingCost() : BigDecimal.ZERO;
        BigDecimal total = taxableAmount.add(shipping).add(tax);

        // 3. Create Order
        Order order = new Order();
        order.setOrderNumber("AUR-2026-" + (1000 + new Random().nextInt(9000)));
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setAddressLine1(request.getAddressLine1());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPostalCode(request.getPostalCode());
        order.setPhone(request.getPhone());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD");
        order.setPaymentStatus("PAID");
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setShipping(shipping);
        order.setTax(tax);
        order.setTotal(total);
        order.setAppliedCoupon(appliedCouponCode);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTrackingNumber("TRK" + System.currentTimeMillis());
        order.setCarrier(shipping.compareTo(new BigDecimal("15")) > 0 ? "FedEx Priority Overnight" : "UPS Ground Express");
        order.setEstimatedDelivery(LocalDate.now().plusDays(3).format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        return new ResponseEntity<>(Map.of("success", true, "order", saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(Order.OrderStatus.valueOf(statusStr.toUpperCase()));
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
