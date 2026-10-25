package techtalks.com.souqflow.product;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import techtalks.com.souqflow.merchant.Merchant;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {

    private Long id;


    private Long merchantId;

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Name must be less than 255 characters")
    private String name;

    private String description;

    @NotNull(message = "USD price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "USD price must be positive")
    private BigDecimal priceUsd;

    @DecimalMin(value = "0.0", inclusive = true, message = "LBP price must be positive")
    private BigDecimal priceLbp;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Min(value = 0, message = "Low stock threshold cannot be negative")
    private Integer lowStockThreshold;

    private String sku;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static ProductDTO fromEntity(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setMerchantId(product.getMerchant() != null ? product.getMerchant().getId() : null);
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPriceUsd(product.getPriceUsd());
        dto.setPriceLbp(product.getPriceLbp());
        dto.setQuantity(product.getQuantity());
        dto.setLowStockThreshold(product.getLowStockThreshold());
        dto.setSku(product.getSku());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    public Product toEntity(Merchant merchant) {
        Product product = new Product();
        product.setId(this.id);
        product.setName(this.name);
        product.setDescription(this.description);
        product.setPriceUsd(this.priceUsd);
        product.setPriceLbp(this.priceLbp);
        product.setQuantity(this.quantity);
        if (this.lowStockThreshold != null) {
            product.setLowStockThreshold(this.lowStockThreshold);
        }
        product.setSku(this.sku);
        product.setMerchant(merchant);
        return product;
    }
}