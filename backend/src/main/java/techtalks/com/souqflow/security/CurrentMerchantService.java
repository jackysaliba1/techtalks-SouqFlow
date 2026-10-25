package techtalks.com.souqflow.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import techtalks.com.souqflow.repository.UserRepository;

@Service
public class CurrentMerchantService {

    private final UserRepository userRepository;

    public CurrentMerchantService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long getCurrentMerchantId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new AccessDeniedException("You must be logged in");
        }

        String email = auth.getName();

        return userRepository.findMerchantIdByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("This account is not linked to a merchant"));
    }
}