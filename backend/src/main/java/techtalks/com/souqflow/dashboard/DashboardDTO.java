package techtalks.com.souqflow.dashboard;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DashboardDTO {

    // Products and Inventory
    private long totalProducts;
    private long totalStockUnits;
    private long lowStockCount;
    private long outOfStockCount;

    // Later sections (customers, orders, payments, invoices) will be added here
}