package techtalks.com.souqflow.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentDTO {

    private Long id;
    private Long orderId;
    private BigDecimal amountUsd;
    private String method;
    private String status;
    private LocalDateTime createdAt;

    public static PaymentDTO toDto(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setAmountUsd(payment.getAmountUsd());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}