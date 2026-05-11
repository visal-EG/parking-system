package com.parking.dto;

import com.parking.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 64) String username,
            @NotBlank @Size(min = 6) String password,
            @Email String email
    ) {}

    public record AuthResponse(String token, String username, Role role, Long userId) {}

    public record MeResponse(Long id, String username, String email, Role role) {}
}
