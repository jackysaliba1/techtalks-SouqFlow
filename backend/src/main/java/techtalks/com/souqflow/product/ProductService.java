package techtalks.com.souqflow.product;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByMerchant(Long merchantId) {
        return productRepository.findByMerchantId(merchantId);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPriceUsd(updatedProduct.getPriceUsd());
        existing.setPriceLbp(updatedProduct.getPriceLbp());
        existing.setQuantity(updatedProduct.getQuantity());
        existing.setLowStockThreshold(updatedProduct.getLowStockThreshold());
        existing.setSku(updatedProduct.getSku());

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}