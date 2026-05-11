package com.parking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_spot")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingSpot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private SpotType type;

    @Column(nullable = false)
    private boolean occupied;

    @Version
    private Long version;
}
