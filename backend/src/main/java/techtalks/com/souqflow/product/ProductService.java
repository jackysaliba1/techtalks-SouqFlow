package techtalks.com.souqflow.product;

import org.springframework.stereotype.Service;
import techtalks.com.souqflow.merchant.Merchant;
import techtalks.com.souqflow.merchant.MerchantRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;

    public ProductService(ProductRepository productRepository, MerchantRepository merchantRepository) {
        this.productRepository = productRepository;
        this.merchantRepository = merchantRepository;
    }

    public ProductDTO createProduct(ProductDTO productDto) {
        Merchant merchant = merchantRepository.findById(productDto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found with id: " + productDto.getMerchantId()));

        Product entity = productDto.toEntity(merchant);
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