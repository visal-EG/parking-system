package com.parking.service;

import com.parking.entity.RateCard;
import com.parking.entity.VehicleType;
import com.parking.repository.RateCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final RateCardRepository rateCardRepository;

    public BigDecimal calculate(VehicleType type, Duration duration) {
        RateCard r = rateCardRepository.findByVehicleType(type)
                .orElseThrow(() -> new IllegalStateException("No rate card for " + type));

        long minutes = Math.max(1, duration.toMinutes());
        long billedHours = (long) Math.ceil(minutes / 60.0);

        BigDecimal fee;
        if (billedHours <= 1) {
            fee = r.getFirstHourRate();
        } else {
            fee = r.getFirstHourRate()
                    .add(r.getHourlyRate().multiply(BigDecimal.valueOf(billedHours - 1)));
        }

        long days = Math.max(1, (long) Math.ceil(billedHours / 24.0));
        BigDecimal cap = r.getDailyCap().multiply(BigDecimal.valueOf(days));
        return fee.min(cap);
    }
}
