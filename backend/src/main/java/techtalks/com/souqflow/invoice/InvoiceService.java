package techtalks.com.souqflow.invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.exceptions.BusinessRuleException;
import techtalks.com.souqflow.exceptions.ResourceNotFoundException;
import techtalks.com.souqflow.exceptions.ResourceNotFoundException;
import techtalks.com.souqflow.invoice.dto.ConvertRequest;
import techtalks.com.souqflow.invoice.dto.InvoiceResponse;
import techtalks.com.souqflow.quote.Quote;
import techtalks.com.souqflow.quote.QuoteItem;
import techtalks.com.souqflow.quote.QuoteRepository;
import techtalks.com.souqflow.quote.QuoteStatus;
import techtalks.com.souqflow.quote.dto.ItemResponse;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final QuoteRepository quoteRepository;

    // ---------- 1. Convert a quote into an invoice ----------
    @Transactional
    public InvoiceResponse convertQuote(Long quoteId, ConvertRequest req) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found: " + quoteId));

        if (quote.getStatus() != QuoteStatus.ACCEPTED) {
            throw new BusinessRuleException("Only ACCEPTED quotes can be converted");
        }
        if (invoiceRepository.existsByQuoteId(quoteId)) {
            throw new BusinessRuleException("This quote was already converted");
        }

        Invoice invoice = new Invoice();
        invoice.setCustomer(quote.getCustomer());
        invoice.setQuote(quote);
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(req.dueDate());
        invoice.setNotes(quote.getNotes());
        invoice.setTotal(quote.getTotal());

        for (QuoteItem qi : quote.getItems()) {
            InvoiceItem ii = new InvoiceItem();
            ii.setDescription(qi.getDescription());
            ii.setQuantity(qi.getQuantity());
            ii.setUnitPrice(qi.getUnitPrice());
            ii.setLineTotal(qi.getLineTotal());
            invoice.addItem(ii);
        }

        Invoice saved = invoiceRepository.save(invoice);
        saved.setInvoiceNumber(String.format("INV-%05d", saved.getId()));
        quote.setStatus(QuoteStatus.CONVERTED);

        // TODO: update the customer balance (Sprint 4 balance logic)

        return toResponse(saved);
    }

    // ---------- 2. Read ----------
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAll() {
        return invoiceRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(Long id) {
        return toResponse(find(id));
    }

    // ---------- 3. Cancel ----------
    @Transactional
    public InvoiceResponse cancel(Long id) {
        Invoice invoice = find(id);
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BusinessRuleException("Paid invoices cannot be cancelled");
        }
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new BusinessRuleException("Invoice is already cancelled");
        }
        invoice.setStatus(InvoiceStatus.CANCELLED);

        // TODO: reverse the customer balance (Sprint 4 balance logic)

        return toResponse(invoice);
    }

    // ---------- helpers ----------
    private Invoice find(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    private InvoiceResponse toResponse(Invoice inv) {
        List<ItemResponse> items = inv.getItems().stream()
                .map(i -> new ItemResponse(i.getDescription(), i.getQuantity(),
                        i.getUnitPrice(), i.getLineTotal()))
                .toList();
        return new InvoiceResponse(
                inv.getId(),
                inv.getInvoiceNumber(),
                inv.getCustomer().getId(),
                inv.getCustomer().getName(),
                inv.getQuote() != null ? inv.getQuote().getId() : null,
                inv.getStatus(),
                inv.getIssueDate(),
                inv.getDueDate(),
                inv.getTotal(),
                inv.getNotes(),
                items);
    }
}
