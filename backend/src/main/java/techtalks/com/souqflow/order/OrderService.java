package techtalks.com.souqflow.order;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        CustomerRepository customerRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public OrderDTO create(OrderDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        BigDecimal totalUsd = BigDecimal.ZERO;
        List<Long> productIds = dto.getProductIds();
        List<Integer> quantities = dto.getQuantities();

        for (int i = 0; i < productIds.size(); i++) {
            Long productId = productIds.get(i);
            int quantity = quantities.get(i);

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

            if (product.getStock() < quantity) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
            }

            product.setStock(product.getStock() - quantity);
            productRepository.save(product);

            totalUsd = totalUsd.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus("PENDING");
        order.setTotalUsd(totalUsd);

        Order savedOrder = orderRepository.save(order);
        return toDto(savedOrder);
    }

    public List<OrderDTO> getAll() {
        return orderRepository.findAll().stream().map(this::toDto).toList();
    }

    public OrderDTO getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return toDto(order);
    }

    public OrderDTO updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return toDto(orderRepository.save(order));
    }

    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    private OrderDTO toDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setStatus(order.getStatus());
        dto.setTotalUsd(order.getTotalUsd());
        dto.setTotalLbp(order.getTotalLbp());
        return dto;
    }
}