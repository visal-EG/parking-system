package com.parking.dto;

import com.parking.entity.SpotType;

import java.time.Instant;
import java.util.List;

public class ReservationDtos {

    public record ReserveRequest(Long spotId) {}

    public record ReservationResponse(
            Long id,
            Long spotId,
            String spotCode,
            String floorCode,
            SpotType spotType,
            String status,
            Instant createdAt,
            Instant expiresAt,
            String ticketNo
    ) {}

    public record SpotDetail(Long id, String code, String type, boolean occupied, boolean reserved) {}

    public record FloorSpotsResponse(String floorCode, int level, List<SpotDetail> spots) {}

    public record TrackResponse(
            String ticketNo,
            String spotCode,
            String floorCode,
            String mallName,
            String city,
            String status,
            Instant createdAt,
            Instant expiresAt
    ) {}
}
