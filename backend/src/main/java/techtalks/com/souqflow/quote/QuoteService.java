package techtalks.com.souqflow.quote;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.customer.Customer;
import techtalks.com.souqflow.customer.CustomerRepository;
import techtalks.com.souqflow.exceptions.BusinessRuleException;
import techtalks.com.souqflow.exceptions.ResourceNotFoundException;
import techtalks.com.souqflow.quote.dto.ItemRequest;
import techtalks.com.souqflow.quote.dto.ItemResponse;
import techtalks.com.souqflow.quote.dto.QuoteRequest;
import techtalks.com.souqflow.quote.dto.QuoteResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class QuoteService {
    private final QuoteRepository quoteRepository;
    private final CustomerRepository customerRepository;   // from earlier sprints

    @Transactional
    public QuoteResponse create(QuoteRequest req) {
        Customer customer = customerRepository.findById(req.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Quote quote = new Quote();
        quote.setCustomer(customer);
        quote.setIssueDate(LocalDate.now());
        quote.setValidUntil(req.validUntil());
        quote.setNotes(req.notes());

        BigDecimal total = BigDecimal.ZERO;
        for (ItemRequest i : req.items()) {
            QuoteItem item = new QuoteItem();
            item.setDescription(i.description());
            item.setQuantity(i.quantity());
            item.setUnitPrice(i.unitPrice());
            BigDecimal line = i.unitPrice().multiply(BigDecimal.valueOf(i.quantity()));
            item.setLineTotal(line);
            quote.addItem(item);
            total = total.add(line);
        }
        quote.setTotal(total);

        Quote saved = quoteRepository.save(quote);                    // id now exists
        saved.setQuoteNumber(String.format("QT-%05d", saved.getId())); // saved automatically at commit
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public QuoteResponse getById(Long id) { return toResponse(find(id)); }

    @Transactional(readOnly = true)
    public List<QuoteResponse> getAll() {
        return quoteRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public QuoteResponse updateStatus(Long id, QuoteStatus newStatus) {
        Quote quote = find(id);
        if (quote.getStatus() == QuoteStatus.CONVERTED) {
            throw new BusinessRuleException("Converted quotes cannot be changed");
        }
        if (newStatus == QuoteStatus.CONVERTED) {
            throw new BusinessRuleException("Use the convert endpoint instead");
        }
        quote.setStatus(newStatus);
        return toResponse(quote);
    }

    Quote find(Long id) {
        return quoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found: " + id));
    }

    QuoteResponse toResponse(Quote q) {
        List<ItemResponse> items = q.getItems().stream()
                .map(i -> new ItemResponse(i.getDescription(), i.getQuantity(), i.getUnitPrice(), i.getLineTotal()))
                .toList();
        return new QuoteResponse(q.getId(), q.getQuoteNumber(), q.getCustomer().getId(),
                q.getCustomer().getName(), q.getStatus(), q.getIssueDate(), q.getValidUntil(),
                q.getTotal(), q.getNotes(), items);
    }
}
