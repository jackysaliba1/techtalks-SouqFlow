package techtalks.com.souqflow.product;
import techtalks.com.souqflow.exception.InsufficientStockException;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class InventoryService {
    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }
    public boolean isStockAvailable(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return product.getQuantity() >= quantity;
    }

    public void deductStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        if (product.getQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }
}
