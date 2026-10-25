package techtalks.com.souqflow.product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import techtalks.com.souqflow.exception.InsufficientStockException;
import techtalks.com.souqflow.security.CurrentMerchantService;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final ProductRepository productRepository;
    private final CurrentMerchantService currentMerchantService;

    public InventoryService(ProductRepository productRepository,
                            CurrentMerchantService currentMerchantService) {
        this.productRepository = productRepository;
        this.currentMerchantService = currentMerchantService;
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

        Long merchantId = currentMerchantService.getCurrentMerchantId();

        int updated = productRepository.deductIfAvailable(productId, merchantId, quantity);

        if (updated == 0) {
            Product product = productRepository.findByIdAndMerchantId(productId, merchantId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Product not found with id: " + productId));
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }

        Product product = productRepository.findByIdAndMerchantId(productId, merchantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found with id: " + productId));

        if (product.isLowStock()) {
            log.warn("Low stock: '{}' has {} left (threshold {})",
                    product.getName(), product.getQuantity(), product.getLowStockThreshold());
        }
    }
}