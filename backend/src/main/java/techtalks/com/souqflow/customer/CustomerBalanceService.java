package techtalks.com.souqflow.customer;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CustomerBalanceService {

    private final CustomerRepository customerRepository;

    public CustomerBalanceService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public void deductBalance(Long customerId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        int updated = customerRepository.deductBalanceIfAvailable(customerId, amount);

        if (updated == 0) {
            throw new IllegalStateException(
                    "Customer not found or insufficient balance for customer " + customerId);
        }
    }
}