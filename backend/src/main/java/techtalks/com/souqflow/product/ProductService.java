package techtalks.com.souqflow.product;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import techtalks.com.souqflow.merchant.Merchant;
import techtalks.com.souqflow.merchant.MerchantRepository;
import techtalks.com.souqflow.security.CurrentMerchantService;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final CurrentMerchantService currentMerchantService;

    public ProductService(ProductRepository productRepository,
                          MerchantRepository merchantRepository,
                          CurrentMerchantService currentMerchantService) {
        this.productRepository = productRepository;
        this.merchantRepository = merchantRepository;
        this.currentMerchantService = currentMerchantService;
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDto) {
        Long merchantId = currentMerchantService.getCurrentMerchantId();

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Merchant not found"));

        // The merchantId sent by the client (if any) is ignored on purpose
        Product entity = productDto.toEntity(merchant);
        entity.setId(null); // a create must never overwrite an existing row
        Product saved = productRepository.save(entity);
        return ProductDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        Long merchantId = currentMerchantService.getCurrentMerchantId();
        return productRepository.findByMerchantId(merchantId)
                .stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Long merchantId = currentMerchantService.getCurrentMerchantId();
        return ProductDTO.fromEntity(findOwnedProduct(id, merchantId));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO updatedProduct) {
        Long merchantId = currentMerchantService.getCurrentMerchantId();
        Product existing = findOwnedProduct(id, merchantId);

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPriceUsd(updatedProduct.getPriceUsd());
        existing.setPriceLbp(updatedProduct.getPriceLbp());
        existing.setQuantity(updatedProduct.getQuantity());
        if (updatedProduct.getLowStockThreshold() != null) {
            existing.setLowStockThreshold(updatedProduct.getLowStockThreshold());
        }
        existing.setSku(updatedProduct.getSku());

        Product saved = productRepository.save(existing);
        return ProductDTO.fromEntity(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Long merchantId = currentMerchantService.getCurrentMerchantId();
        Product existing = findOwnedProduct(id, merchantId);
        productRepository.delete(existing);
    }

    // ---------- Low-stock logic ----------

    @Transactional(readOnly = true)
    public List<ProductDTO> getLowStockProducts() {
        Long merchantId = currentMerchantService.getCurrentMerchantId();
        return productRepository.findLowStockByMerchant(merchantId)
                .stream()
                .map(ProductDTO::fromEntity)
                .toList();
    }

    // ---------- Helper ----------

    private Product findOwnedProduct(Long id, Long merchantId) {
        return productRepository.findByIdAndMerchantId(id, merchantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found with id: " + id));
    }
}