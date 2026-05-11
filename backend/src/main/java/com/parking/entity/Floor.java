package com.parking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "floor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Floor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private ParkingLot lot;

    @Column(nullable = false, length = 16)
    private String code;

    @Column(nullable = false)
    private int level;
}
