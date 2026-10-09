package techtalks.com.souqflow.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Modifying
    @Query("""
            update Customer c
            set c.balanceUsd = c.balanceUsd - :amount
            where c.id = :id
              and c.balanceUsd >= :amount
            """)
    int deductBalanceIfAvailable(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("""
            update Customer c
            set c.balanceUsd = c.balanceUsd + :amount
            where c.id = :id
            """)
    int addBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);
}