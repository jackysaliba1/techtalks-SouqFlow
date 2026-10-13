package techtalks.com.souqflow.quote;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import techtalks.com.souqflow.customer.Customer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotes")
@Getter
@Setter
@NoArgsConstructor
public class Quote {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String QuoteNumber;

    @ManyToOne(fetch=FetchType.LAZY,optional=false)
    @JoinColumn(name="customer_id")
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status=QuoteStatus.DRAFT;

    private LocalDate issueDate;
    private LocalDate validUntil;

    @Column(nullable = false,precision=12,scale=2)
    private BigDecimal total=BigDecimal.ZERO;

    private String notes;
    @OneToMany(mappedBy = "quote",cascade=CascadeType.ALL,orphanRemoval = true)
    private List<QuoteItem> items=new ArrayList<>();

    private LocalDateTime createdAt=LocalDateTime.now();

    public void addItem(QuoteItem item){
        item.setQuote(this);
        items.add(item);
    }
}
