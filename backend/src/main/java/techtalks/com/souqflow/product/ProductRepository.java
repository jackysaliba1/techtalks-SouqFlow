package techtalks.com.souqflow.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ---------- Lookups, always scoped to one merchant ----------

    List<Product> findByMerchantId(Long merchantId);

    Optional<Product> findByIdAndMerchantId(Long id, Long merchantId);

    List<Product> findByMerchantIdAndNameContainingIgnoreCase(Long merchantId, String name);

    // ---------- Stock deduction (atomic, scoped to the merchant) ----------

    @Modifying(clearAutomatically = true)
    @Query("""
        update Product p
        set p.quantity = p.quantity - :qty,
            p.updatedAt = CURRENT_TIMESTAMP
        where p.id = :id
          and p.merchant.id = :merchantId
          and p.quantity >= :qty
        """)
    int deductIfAvailable(@Param("id") Long id,
                          @Param("merchantId") Long merchantId,
                          @Param("qty") int qty);

    // ---------- Low stock ----------

    @Query("""
        select p from Product p
        where p.merchant.id = :merchantId
          and p.quantity > 0
          and p.quantity <= coalesce(p.lowStockThreshold, 5)
        """)
    List<Product> findLowStockByMerchant(@Param("merchantId") Long merchantId);

    // ---------- Dashboard counts ----------

    long countByMerchantId(Long merchantId);

    long countByMerchantIdAndQuantity(Long merchantId, Integer quantity);

    @Query("""
        select count(p) from Product p
        where p.merchant.id = :merchantId
          and p.quantity > 0
          and p.quantity <= coalesce(p.lowStockThreshold, 5)
        """)
    long countLowStockByMerchant(@Param("merchantId") Long merchantId);

    @Query("select coalesce(sum(p.quantity), 0L) from Product p where p.merchant.id = :merchantId")
    long sumQuantityByMerchant(@Param("merchantId") Long merchantId);
}