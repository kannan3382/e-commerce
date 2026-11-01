package com.aura.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequest {
    private String customerName;
    private String customerEmail;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private String phone;
    private String paymentMethod;
    private BigDecimal shippingCost;
    private String couponCode;
    private List<ItemDto> items;

    @Data
    public static class ItemDto {
        private Long productId;
        private String name;
        private BigDecimal price;
        private Integer quantity;
        private String image;
    }
}
