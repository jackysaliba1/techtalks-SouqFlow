package techtalks.com.souqflow.invoice.dto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record ConvertRequest(@NotNull LocalDate dueDate) {
}
