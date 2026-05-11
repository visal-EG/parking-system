package com.parking.service;

import com.parking.dto.AuthDtos.*;
import com.parking.entity.Role;
import com.parking.entity.User;
import com.parking.repository.UserRepository;
import com.parking.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.username()))
            throw new IllegalArgumentException("Username already exists");

        User u = User.builder()
                .username(req.username())
                .password(passwordEncoder.encode(req.password()))
                .email(req.email())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        userRepository.save(u);
        return new AuthResponse(jwtService.generate(u), u.getUsername(), u.getRole(), u.getId());
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        User u = userRepository.findByUsername(req.username()).orElseThrow();
        return new AuthResponse(jwtService.generate(u), u.getUsername(), u.getRole(), u.getId());
    }

    public MeResponse me(String username) {
        User u = userRepository.findByUsername(username).orElseThrow();
        return new MeResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole());
    }
}
