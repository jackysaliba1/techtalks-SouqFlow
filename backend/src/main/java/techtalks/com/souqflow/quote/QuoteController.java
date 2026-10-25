package techtalks.com.souqflow.quote;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import techtalks.com.souqflow.invoice.InvoiceService;
import techtalks.com.souqflow.invoice.dto.ConvertRequest;
import techtalks.com.souqflow.invoice.dto.InvoiceResponse;
import techtalks.com.souqflow.quote.dto.QuoteRequest;
import techtalks.com.souqflow.quote.dto.QuoteResponse;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {
    private final QuoteService quoteService;
    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<QuoteResponse> create(@Valid @RequestBody QuoteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quoteService.create(req));
    }

    @GetMapping
    public List<QuoteResponse> getAll() { return quoteService.getAll(); }

    @GetMapping("/{id}")
    public QuoteResponse getById(@PathVariable Long id) { return quoteService.getById(id); }

    @PatchMapping("/{id}/status")
    public QuoteResponse updateStatus(@PathVariable Long id, @RequestParam QuoteStatus status) {
        return quoteService.updateStatus(id, status);
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<InvoiceResponse> convert(@PathVariable Long id,
                                                   @Valid @RequestBody ConvertRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.convertQuote(id, req));
    }
}
