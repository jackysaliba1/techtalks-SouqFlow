package techtalks.com.souqflow;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.product.ProductRepository;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public void deductStock(Long productId, int requestedQty) {

        if (requestedQty <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        int updated = productRepository.deductIfAvailable(productId, requestedQty);

        if (updated == 0) {
            throw new IllegalStateException(
                    "Product not found or not enough stock for product " + productId);
        }
    }
}