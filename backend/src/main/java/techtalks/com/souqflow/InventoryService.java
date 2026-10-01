package techtalks.com.souqflow.product;

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
        return product.getStock() >= quantity;
    }
    public void deductStock(Long productId, int quantity){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        if(product.getStock() < quantity){
            throw new InsufficientStockException("Insufficient stock for product: "+ product.getName());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}
