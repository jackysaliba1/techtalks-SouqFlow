package techtalks.com.souqflow.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByMerchantId(Long merchantId);

    List<Product> findByNameContainingIgnoreCase(String name);
}
