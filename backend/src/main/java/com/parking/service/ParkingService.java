package com.parking.service;

import com.parking.dto.ParkingDtos.*;
import com.parking.entity.*;
import com.parking.exception.LotFullException;
import com.parking.exception.NotFoundException;
import com.parking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParkingService {

    private final ParkingSpotRepository spotRepo;
    private final TicketRepository ticketRepo;
    private final VehicleRepository vehicleRepo;
    private final FloorRepository floorRepo;
    private final PricingService pricingService;
    private final ReservationService reservationService;
    private final ReservationRepository reservationRepo;

    @Transactional
    public EntryResponse enter(EntryRequest req, Long issuedBy) {
        SpotType spotType = SpotType.valueOf(req.vehicleType().name());

        ParkingSpot spot = spotRepo.findFirstFreeForUpdate(spotType)
                .orElseThrow(() -> new LotFullException("No free " + spotType + " spot available"));

        spot.setOccupied(true);

        Vehicle v = vehicleRepo.findByLicensePlate(req.licensePlate())
                .orElseGet(() -> vehicleRepo.save(Vehicle.builder()
                        .licensePlate(req.licensePlate())
                        .type(req.vehicleType())
                        .build()));

        Ticket t = Ticket.builder()
                .ticketNo(generateTicketNo())
                .vehicle(v)
                .spot(spot)
                .entryTime(Instant.now())
                .status(TicketStatus.ACTIVE)
                .issuedBy(issuedBy)
                .build();
        ticketRepo.save(t);

        reservationService.fulfillBySpot(spot.getId());

        log.info("Ticket {} issued for {} at spot {}", t.getTicketNo(), v.getLicensePlate(), spot.getCode());

        return new EntryResponse(
                t.getTicketNo(),
                spot.getCode(),
                spot.getFloor().getCode(),
                req.vehicleType(),
                t.getEntryTime()
        );
    }

    @Transactional(readOnly = true)
    public FeeQuote quote(String ticketNo) {
        Ticket t = ticketRepo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        if (t.getStatus() != TicketStatus.ACTIVE)
            throw new IllegalStateException("Ticket is not active");
        Duration d = Duration.between(t.getEntryTime(), Instant.now());
        var fee = pricingService.calculate(t.getVehicle().getType(), d);
        return new FeeQuote(t.getTicketNo(), d.toMinutes(), fee);
    }

    @Transactional(readOnly = true)
    public List<OccupancyRow> occupancy() {
        List<OccupancyRow> rows = new ArrayList<>();
        for (Floor f : floorRepo.findAllByOrderByLevelDesc()) {
            for (SpotType type : SpotType.values()) {
                long occ = spotRepo.countByFloor_IdAndTypeAndOccupied(f.getId(), type, true);
                long reserved = reservationRepo.countActiveByFloorAndType(f.getId(), type);
                long cap = occ + spotRepo.countByFloor_IdAndTypeAndOccupied(f.getId(), type, false);
                rows.add(new OccupancyRow(f.getCode(), type.name(), occ + reserved, cap));
            }
        }
        return rows;
    }

    private String generateTicketNo() {
        String date = DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneOffset.UTC).format(Instant.now());
        return "T-" + date + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
