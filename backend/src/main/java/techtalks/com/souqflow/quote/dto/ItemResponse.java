package techtalks.com.souqflow.quote.dto;

import java.math.BigDecimal;

public record ItemResponse(String description, Integer quantity,
                           BigDecimal unitPrice, BigDecimal lineTotal) {
}
