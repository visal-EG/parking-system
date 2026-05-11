package com.parking.dto;

import com.parking.entity.PaymentMethod;
import com.parking.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public class ParkingDtos {

    public record EntryRequest(@NotBlank String licensePlate, @NotNull VehicleType vehicleType) {}

    public record EntryResponse(
            String ticketNo,
            String spotCode,
            String floorCode,
            VehicleType vehicleType,
            Instant entryTime
    ) {}

    public record FeeQuote(String ticketNo, long minutesParked, BigDecimal amount) {}

    public record ExitRequest(@NotNull PaymentMethod method) {}

    public record Receipt(
            String ticketNo,
            String licensePlate,
            String spotCode,
            Instant entryTime,
            Instant exitTime,
            BigDecimal amount,
            PaymentMethod method
    ) {}

    public record OccupancyRow(String floorCode, String type, long occupied, long capacity) {}
}
