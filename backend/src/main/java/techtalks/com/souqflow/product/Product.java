package techtalks.com.souqflow.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import techtalks.com.souqflow.merchant.Merchant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @NotBlank
    @Column(nullable = false)
    private String name;


    @Column(columnDefinition = "TEXT")
    private String description;

    @DecimalMin(value = "0.0")
    @Column(name = "price_usd", precision = 10, scale = 2)
    private BigDecimal priceUsd;

    @DecimalMin(value = "0.0")
    @Column(name = "price_lbp", precision = 15, scale = 2)
    private BigDecimal priceLbp;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer quantity = 0;

    @Min(0)

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;

    private String sku;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}