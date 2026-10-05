package techtalks.com.souqflow.payment;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import techtalks.com.souqflow.order.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "amount_usd", precision = 10, scale = 2)
    private BigDecimal amountUsd;

    @DecimalMin(value = "0.0")
    @Column(name = "amount_lbp", precision = 15, scale = 2)
    private BigDecimal amountLbp;

    @NotBlank
    @Column(nullable = false)
    private String method = "CASH";

    @NotBlank
    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "provider_reference")
    private String providerReference;

    @Column(name = "masked_account")
    private String maskedAccount;
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