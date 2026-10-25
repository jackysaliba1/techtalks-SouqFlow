package techtalks.com.souqflow.invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByCustomerId(Long customerId);
    boolean existsByQuoteId(Long quoteId);
}
