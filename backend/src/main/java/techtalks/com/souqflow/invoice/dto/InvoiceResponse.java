package techtalks.com.souqflow.invoice.dto;

import techtalks.com.souqflow.invoice.InvoiceStatus;
import techtalks.com.souqflow.quote.dto.ItemResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record InvoiceResponse(Long id, String invoiceNumber, Long customerId, String customerName,
                              Long quoteId, InvoiceStatus status, LocalDate issueDate,
                              LocalDate dueDate, BigDecimal total, String notes,
                              List<ItemResponse> items) {
}
