package com.parking.controller;

import com.parking.dto.ParkingDtos.*;
import com.parking.entity.ParkingLot;
import com.parking.repository.ParkingLotRepository;
import com.parking.repository.ParkingSpotRepository;
import com.parking.repository.UserRepository;
import com.parking.repository.FloorRepository;
import com.parking.service.ParkingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;
    private final UserRepository userRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final FloorRepository floorRepository;

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

    @GetMapping("/cities")
    public List<String> cities() {
        return parkingLotRepository.findDistinctCities();
    }

    @GetMapping("/cities/{city}/malls")
    public List<Map<String, Object>> mallsByCity(@PathVariable String city) {
        List<ParkingLot> lots = parkingLotRepository.findByCityOrderByNameAsc(city);
        return lots.stream().map(lot -> {
            var floors = floorRepository.findByLot_IdOrderByLevelDesc(lot.getId());
            long totalSpots = 0;
            long occupiedSpots = 0;
            for (var floor : floors) {
                var spots = parkingSpotRepository.findByFloor_IdOrderByCodeAsc(floor.getId());
                totalSpots += spots.size();
                occupiedSpots += spots.stream().filter(s -> s.isOccupied()).count();
            }
            return Map.<String, Object>of(
                    "id", lot.getId(),
                    "name", lot.getName(),
                    "address", lot.getAddress() != null ? lot.getAddress() : "",
                    "city", lot.getCity(),
                    "totalSpots", totalSpots,
                    "occupiedSpots", occupiedSpots,
                    "availableSpots", totalSpots - occupiedSpots,
                    "floors", floors.size()
            );
        }).toList();
    }
}
