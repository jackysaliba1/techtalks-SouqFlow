package techtalks.com.souqflow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import techtalks.com.souqflow.product.Product;
import techtalks.com.souqflow.product.ProductRepository;
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

    @Transactional
    public void deductStock(Long productId, int requestedQty) {

        if (requestedQty <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Long merchantId = currentMerchantService.getCurrentMerchantId();

        int updated = productRepository.deductIfAvailable(productId, merchantId, requestedQty);

        if (updated == 0) {
            throw new IllegalStateException(
                    "Product not found or not enough stock for product " + productId);
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