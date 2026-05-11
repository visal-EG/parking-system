package com.parking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_lot")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingLot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 128)
    private String name;

    private String address;

    @Column(nullable = false, length = 64)
    private String city;
}
