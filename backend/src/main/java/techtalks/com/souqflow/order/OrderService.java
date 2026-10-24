package techtalks.com.souqflow.order;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import techtalks.com.souqflow.InventoryService;
import techtalks.com.souqflow.customer.Customer;
import techtalks.com.souqflow.customer.CustomerRepository;
import techtalks.com.souqflow.product.Product;
import techtalks.com.souqflow.product.ProductRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository, ProductRepository productRepository, InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public OrderDTO create(OrderDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        BigDecimal totalUsd = BigDecimal.ZERO;
        List<Long> productIds = dto.getProductIds();
        List<Integer> quantities = dto.getQuantities();

        for (int i = 0; i < productIds.size(); i++) {
            Long product_id = productIds.get(i);
            int qty = quantities.get(i);
            Product product = productRepository.findById(product_id).orElseThrow(() -> new RuntimeException("Product not found with id: " + product_id));
            inventoryService.deductStock(product_id, qty);
            totalUsd = totalUsd.add(product.getPriceUsd().multiply(BigDecimal.valueOf(quantities.get(i))));
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
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return toDto(order);
    }

    public OrderDTO updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        String current = order.getStatus();
        boolean valid = "PENDING".equals(current)
                && ("PAID".equals(status) || "CANCELLED".equals(status));

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot change an order from " + current + " to " + status);
        }

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
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}