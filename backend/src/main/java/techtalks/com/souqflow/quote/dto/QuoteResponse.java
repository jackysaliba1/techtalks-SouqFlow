package techtalks.com.souqflow.quote.dto;

import techtalks.com.souqflow.quote.QuoteStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record QuoteResponse(Long id, String quoteNumber, Long customerId, String customerName,
                            QuoteStatus status, LocalDate issueDate, LocalDate validUntil,
                            BigDecimal total, String notes, List<ItemResponse> items) {
}
