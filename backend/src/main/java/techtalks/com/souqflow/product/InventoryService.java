package techtalks.com.souqflow.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.exception.InsufficientStockException;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public boolean isStockAvailable(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return product.getQuantity() >= quantity;
    }

    @Transactional
    public void deductStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        int updated = productRepository.deductIfAvailable(productId, quantity);

        if (updated == 0) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }
    }
}