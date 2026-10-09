package techtalks.com.souqflow.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByMerchantId(Long merchantId);

    List<Product> findByNameContainingIgnoreCase(String name);
    @Modifying
    @Query("""
        update Product p
        set p.quantity = p.quantity - :qty,
            p.updatedAt = CURRENT_TIMESTAMP
        where p.id = :id
          and p.quantity >= :qty
        """)
    int deductIfAvailable(@Param("id") Long id, @Param("qty") int qty);
}
