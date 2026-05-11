package com.parking.controller;

import com.parking.dto.ParkingDtos.*;
import com.parking.repository.UserRepository;
import com.parking.service.ParkingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;
    private final UserRepository userRepository;

    @PostMapping("/entry")
    public EntryResponse entry(@Valid @RequestBody EntryRequest req,
                               @AuthenticationPrincipal UserDetails user) {
        Long uid = userRepository.findByUsername(user.getUsername()).orElseThrow().getId();
        return parkingService.enter(req, uid);
    }

    @GetMapping("/tickets/{ticketNo}/quote")
    public FeeQuote quote(@PathVariable String ticketNo) {
        return parkingService.quote(ticketNo);
    }

    @GetMapping("/occupancy")
    public List<OccupancyRow> occupancy() {
        return parkingService.occupancy();
    }
}
