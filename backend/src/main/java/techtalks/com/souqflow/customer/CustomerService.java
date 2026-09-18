package techtalks.com.souqflow.customer;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomerDTO create(CustomerDTO dto) {
        Customer customer = CustomerDTO.fromDto(dto);
        Customer saved = customerRepository.save(customer);
        return CustomerDTO.toDto(saved);
    }

    public List<CustomerDTO> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerDTO::toDto)
                .toList();
    }

    public CustomerDTO getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return CustomerDTO.toDto(customer);
    }

    public CustomerDTO update(Long id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());

        Customer updated = customerRepository.save(customer);
        return CustomerDTO.toDto(updated);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}