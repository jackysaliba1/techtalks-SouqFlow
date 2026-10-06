package techtalks.com.souqflow.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techtalks.com.souqflow.customer.CustomerBalanceService;
import techtalks.com.souqflow.order.Order;
import techtalks.com.souqflow.order.OrderRepository;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final CustomerBalanceService customerBalanceService;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          CustomerBalanceService customerBalanceService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.customerBalanceService = customerBalanceService;
    }

    @Transactional
    public PaymentDTO pay(Long orderId, String method) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmountUsd(order.getTotalUsd());
        payment.setMethod(method);

        try {
            customerBalanceService.deductBalance(order.getCustomer().getId(), order.getTotalUsd());
            payment.setStatus("COMPLETED");
            order.setStatus("PAID");
        } catch (IllegalArgumentException | IllegalStateException e) {
            payment.setStatus("FAILED");
        }

        Payment saved = paymentRepository.save(payment);
        return PaymentDTO.toDto(saved);
    }

    public PaymentDTO getById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
        return PaymentDTO.toDto(payment);
    }

    public List<PaymentDTO> getByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(PaymentDTO::toDto)
                .toList();
    }
}