package techtalks.com.souqflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import techtalks.com.souqflow.entity.User;
import techtalks.com.souqflow.repository.UserRepository;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MeController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public Map<String, String> me(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return Map.of(
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "merchantName", user.getMerchant() != null ? user.getMerchant().getName() : ""
        );
    }
}
