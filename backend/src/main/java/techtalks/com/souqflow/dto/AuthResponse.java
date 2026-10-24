package techtalks.com.souqflow.dto;

import lombok.Getter;

@Getter
public class AuthResponse {

    private String token;
    private String fullName;

    public AuthResponse(String token, String fullName) {
        this.token = token;
        this.fullName = fullName;
    }

    public String getToken() {
        return token;
    }

    public String getFullName() {
        return fullName;
    }
}