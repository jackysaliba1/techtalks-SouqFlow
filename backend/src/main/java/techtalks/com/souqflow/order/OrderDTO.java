package techtalks.com.souqflow.order;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
@Getter
@Setter
public class OrderDTO {
    private LocalDateTime createdAt;
    private Long id;

    @NotNull(message = "Customer id is required")
    private Long customerId;

    private String status;

    private BigDecimal totalUsd;
    private BigDecimal totalLbp;

    @NotEmpty(message = "Order must have at least one product")
    private List<@NotNull Long> productIds;

    @NotEmpty(message = "Order must have at least one quantity")
    private List<@NotNull @Positive Integer> quantities;

    @AssertTrue(message = "productIds and quantities must have the same number of entries")
    private boolean isListsSameSize() {
        if (productIds == null || quantities == null) {
            return true; // let @NotEmpty handle the null/empty case separately
        }
        return productIds.size() == quantities.size();
    }
}