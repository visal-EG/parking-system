package com.parking.config;

import com.parking.entity.Role;
import com.parking.entity.User;
import com.parking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seed("admin",    "admin123", Role.ADMIN,    "admin@mall.local");
        seed("operator", "op123",    Role.OPERATOR, "operator@mall.local");
        seed("user",     "user123",  Role.CUSTOMER, "user@mall.local");
    }

    private void seed(String username, String rawPassword, Role role, String email) {
        if (userRepository.existsByUsername(username)) return;
        userRepository.save(User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .email(email)
                .role(role)
                .enabled(true)
                .build());
        log.info("Seeded user: {}", username);
    }
}
