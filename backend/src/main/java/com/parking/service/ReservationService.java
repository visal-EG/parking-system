package com.parking.service;

import com.parking.dto.ReservationDtos.*;
import com.parking.entity.*;
import com.parking.exception.NotFoundException;
import com.parking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final ParkingSpotRepository spotRepo;
    private final FloorRepository floorRepo;
    private final UserRepository userRepo;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Transactional
    public ReservationResponse reserve(Long userId, Long spotId) {
        // One active reservation per customer
        List<Reservation> existing = reservationRepo.findByUser_IdAndStatus(userId, ReservationStatus.ACTIVE);
        if (!existing.isEmpty()) {
            throw new IllegalStateException("You already have an active reservation");
        }

        ParkingSpot spot = spotRepo.findById(spotId)
                .orElseThrow(() -> new NotFoundException("Spot not found"));

        if (spot.isOccupied()) {
            throw new IllegalStateException("Spot is already occupied");
        }

        if (reservationRepo.existsBySpot_IdAndStatus(spotId, ReservationStatus.ACTIVE)) {
            throw new IllegalStateException("Spot is already reserved");
        }

        User user = userRepo.findById(userId).orElseThrow();

        Instant now = Instant.now();
        Reservation r = Reservation.builder()
                .user(user)
                .spot(spot)
                .status(ReservationStatus.ACTIVE)
                .createdAt(now)
                .expiresAt(now.plusSeconds(600)) // 10 minutes
                .ticketNo(generateTicketNo())
                .build();
        reservationRepo.save(r);

        log.info("Reservation {} (ticket {}) created by user {} for spot {}", r.getId(), r.getTicketNo(), userId, spot.getCode());

        return toResponse(r);
    }

    @Transactional
    public void cancel(Long userId, Long reservationId) {
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        if (!r.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not your reservation");
        }

        if (r.getStatus() != ReservationStatus.ACTIVE) {
            throw new IllegalStateException("Reservation is not active");
        }

        r.setStatus(ReservationStatus.CANCELLED);
        r.setCancelledAt(Instant.now());
        log.info("Reservation {} cancelled by user {}", reservationId, userId);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyReservations(Long userId) {
        return reservationRepo.findByUser_IdAndStatus(userId, ReservationStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FloorSpotsResponse> getFloorSpots() {
        return getFloorSpots(null);
    }

    @Transactional(readOnly = true)
    public List<FloorSpotsResponse> getFloorSpots(Long lotId) {
        Set<Long> reservedSpotIds = reservationRepo.findActiveReservedSpotIds()
                .stream().collect(Collectors.toSet());

        List<Floor> floors = (lotId != null)
                ? floorRepo.findByLot_IdOrderByLevelDesc(lotId)
                : floorRepo.findAllByOrderByLevelDesc();

        List<FloorSpotsResponse> result = new ArrayList<>();
        for (Floor f : floors) {
            List<ParkingSpot> spots = spotRepo.findByFloor_IdOrderByCodeAsc(f.getId());
            List<SpotDetail> details = spots.stream()
                    .map(s -> new SpotDetail(
                            s.getId(),
                            s.getCode(),
                            s.getType().name(),
                            s.isOccupied(),
                            reservedSpotIds.contains(s.getId())
                    ))
                    .toList();
            result.add(new FloorSpotsResponse(f.getCode(), f.getLevel(), details));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public TrackResponse trackByTicketNo(String ticketNo) {
        Reservation r = reservationRepo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new NotFoundException("Reservation not found for ticket: " + ticketNo));

        ParkingSpot spot = r.getSpot();
        Floor floor = spot.getFloor();
        ParkingLot lot = floor.getLot();

        return new TrackResponse(
                r.getTicketNo(),
                spot.getCode(),
                floor.getCode(),
                lot.getName(),
                lot.getCity(),
                r.getStatus().name(),
                r.getCreatedAt(),
                r.getExpiresAt()
        );
    }

    @Transactional
    public void fulfillBySpot(Long spotId) {
        reservationRepo.findBySpot_IdAndStatus(spotId, ReservationStatus.ACTIVE)
                .ifPresent(r -> {
                    r.setStatus(ReservationStatus.FULFILLED);
                    log.info("Reservation {} fulfilled for spot {}", r.getId(), spotId);
                });
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void expireReservations() {
        List<Reservation> expired = reservationRepo.findExpired(ReservationStatus.ACTIVE, Instant.now());
        for (Reservation r : expired) {
            r.setStatus(ReservationStatus.EXPIRED);
            log.info("Reservation {} expired for spot {}", r.getId(), r.getSpot().getCode());
        }
        if (!expired.isEmpty()) {
            log.info("Expired {} reservations", expired.size());
        }
    }

    private ReservationResponse toResponse(Reservation r) {
        ParkingSpot spot = r.getSpot();
        return new ReservationResponse(
                r.getId(),
                spot.getId(),
                spot.getCode(),
                spot.getFloor().getCode(),
                spot.getType(),
                r.getStatus().name(),
                r.getCreatedAt(),
                r.getExpiresAt(),
                r.getTicketNo()
        );
    }

    private String generateTicketNo() {
        String date = LocalDate.now().format(DATE_FMT);
        String random = String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
        return "TKT-" + date + "-" + random;
    }
}
