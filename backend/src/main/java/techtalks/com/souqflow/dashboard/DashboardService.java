package techtalks.com.souqflow.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.product.ProductRepository;
import techtalks.com.souqflow.security.CurrentMerchantService;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CurrentMerchantService currentMerchantService;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboard() {
        Long merchantId = currentMerchantService.getCurrentMerchantId();

        DashboardDTO dto = new DashboardDTO();
        dto.setTotalProducts(productRepository.countByMerchantId(merchantId));
        dto.setTotalStockUnits(productRepository.sumQuantityByMerchant(merchantId));
        dto.setLowStockCount(productRepository.countLowStockByMerchant(merchantId));
        dto.setOutOfStockCount(productRepository.countByMerchantIdAndQuantity(merchantId, 0));

        return dto;
    }
}