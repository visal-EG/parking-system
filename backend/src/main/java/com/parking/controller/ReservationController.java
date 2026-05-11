package com.parking.controller;

import com.parking.dto.ReservationDtos.*;
import com.parking.repository.UserRepository;
import com.parking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    @PostMapping
    public ReservationResponse reserve(@RequestBody ReserveRequest req,
                                       @AuthenticationPrincipal UserDetails user) {
        Long uid = userRepository.findByUsername(user.getUsername()).orElseThrow().getId();
        return reservationService.reserve(uid, req.spotId());
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id,
                       @AuthenticationPrincipal UserDetails user) {
        Long uid = userRepository.findByUsername(user.getUsername()).orElseThrow().getId();
        reservationService.cancel(uid, id);
    }

    @GetMapping("/my")
    public List<ReservationResponse> myReservations(@AuthenticationPrincipal UserDetails user) {
        Long uid = userRepository.findByUsername(user.getUsername()).orElseThrow().getId();
        return reservationService.getMyReservations(uid);
    }

    @GetMapping("/floor-spots")
    public List<FloorSpotsResponse> floorSpots() {
        return reservationService.getFloorSpots();
    }
}
