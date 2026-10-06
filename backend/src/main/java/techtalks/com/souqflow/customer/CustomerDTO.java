package techtalks.com.souqflow.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CustomerDTO {

    private Long id;

    private List<Long> orderIds;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^(\\+961|961|0)?(3|70|71|76|78|79|81)\\d{6}$",
            message = "Phone must be a valid Lebanese mobile number"
    )
    private String phone;

    private BigDecimal balanceUsd;

    public static Customer fromDto(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        return customer;
    }

    public static CustomerDTO toDto(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setBalanceUsd(customer.getBalanceUsd());
        dto.setOrderIds(
                customer.getOrders()
                        .stream()
                        .map(order -> order.getId())
                        .toList()
        );
        return dto;
    }
}