package techtalks.com.souqflow.product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDTO createProduct(ProductDTO product) {
        Product entity = product.toEntity();
        Product saved = productRepository.save(entity);
        return ProductDTO.fromEntity(saved);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return ProductDTO.fromEntity(product);
    }

    public List<ProductDTO> getProductsByMerchant(Long merchantId) {
        return productRepository.findByMerchantId(merchantId)
                .stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }

    public ProductDTO updateProduct(Long id, ProductDTO updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPriceUsd(updatedProduct.getPriceUsd());
        existing.setPriceLbp(updatedProduct.getPriceLbp());
        existing.setQuantity(updatedProduct.getQuantity());
        existing.setLowStockThreshold(updatedProduct.getLowStockThreshold());
        existing.setSku(updatedProduct.getSku());

        Product saved = productRepository.save(existing);
        return ProductDTO.fromEntity(saved);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}