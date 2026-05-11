package com.parking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rate_card")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RateCard {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, unique = true, length = 16)
    private VehicleType vehicleType;

    @Column(name = "first_hour_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal firstHourRate;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "daily_cap", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyCap;
}
