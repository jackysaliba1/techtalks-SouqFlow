package techtalks.com.souqflow.invoice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import techtalks.com.souqflow.invoice.dto.ConvertRequest;
import techtalks.com.souqflow.invoice.dto.InvoiceResponse;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    @PostMapping("/from-quote/{quoteId}")
    public ResponseEntity<InvoiceResponse> convertQuote(@PathVariable Long quoteId,
                                                        @Valid @RequestBody ConvertRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(invoiceService.convertQuote(quoteId, req));
    }

    @GetMapping
    public List<InvoiceResponse> getAll() {
        return invoiceService.getAll();
    }

    @GetMapping("/{id}")
    public InvoiceResponse getById(@PathVariable Long id) {
        return invoiceService.getById(id);
    }

    @PatchMapping("/{id}/cancel")
    public InvoiceResponse cancel(@PathVariable Long id) {
        return invoiceService.cancel(id);
    }
}
