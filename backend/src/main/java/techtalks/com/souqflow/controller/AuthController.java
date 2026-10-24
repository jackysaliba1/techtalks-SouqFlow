package techtalks.com.souqflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import techtalks.com.souqflow.dto.AuthResponse;
import techtalks.com.souqflow.dto.LoginRequest;
import techtalks.com.souqflow.dto.RegisterRequest;
import techtalks.com.souqflow.entity.User;
import techtalks.com.souqflow.merchant.Merchant;
import techtalks.com.souqflow.merchant.MerchantRepository;
import techtalks.com.souqflow.repository.UserRepository;
import techtalks.com.souqflow.security.CustomUserDetailsService;
import techtalks.com.souqflow.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          MerchantRepository merchantRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          CustomUserDetailsService userDetailsService,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        // Every new account gets its own merchant
        Merchant merchant = new Merchant();
        merchant.setName(request.getBusinessName() != null && !request.getBusinessName().isBlank()
                ? request.getBusinessName().trim()
                : request.getFullName());
        merchant.setEmail(request.getEmail());
        merchant = merchantRepository.save(merchant);

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setMerchant(merchant);
        userRepository.save(user);

        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());

        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                new AuthResponse(token, user.getFullName())
        );
    }

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
