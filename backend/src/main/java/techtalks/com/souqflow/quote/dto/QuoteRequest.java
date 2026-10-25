package techtalks.com.souqflow.quote.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record QuoteRequest(@NotNull Long customerId,
                           @NotNull LocalDate validUntil,
                           String notes,
                           @NotEmpty @Valid List<ItemRequest> items) {
}
