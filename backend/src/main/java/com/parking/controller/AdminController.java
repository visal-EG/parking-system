package com.parking.controller;

import com.parking.entity.RateCard;
import com.parking.entity.VehicleType;
import com.parking.repository.RateCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RateCardRepository rateCardRepo;

    @GetMapping("/rates")
    public List<RateCard> rates() {
        return rateCardRepo.findAll();
    }

    public record RateUpdate(BigDecimal firstHourRate, BigDecimal hourlyRate, BigDecimal dailyCap) {}

    @PutMapping("/rates/{vehicleType}")
    public RateCard update(@PathVariable VehicleType vehicleType, @RequestBody RateUpdate body) {
        RateCard r = rateCardRepo.findByVehicleType(vehicleType)
                .orElseGet(() -> RateCard.builder().vehicleType(vehicleType).build());
        r.setFirstHourRate(body.firstHourRate());
        r.setHourlyRate(body.hourlyRate());
        r.setDailyCap(body.dailyCap());
        return rateCardRepo.save(r);
    }
}
