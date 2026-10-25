package techtalks.com.souqflow.dto;

import lombok.Getter;

@Getter
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;

    public RegisterRequest() {
    }

    public RegisterRequest(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    private String businessName;

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}