package com.parking.service;

import com.parking.dto.ParkingDtos.*;
import com.parking.entity.*;
import com.parking.exception.NotFoundException;
import com.parking.repository.PaymentRepository;
import com.parking.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final TicketRepository ticketRepo;
    private final PaymentRepository paymentRepo;
    private final PricingService pricingService;

    @Transactional
    public Receipt payAndExit(String ticketNo, PaymentMethod method) {
        Ticket t = ticketRepo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        if (t.getStatus() != TicketStatus.ACTIVE)
            throw new IllegalStateException("Ticket is not active");

        Instant now = Instant.now();
        BigDecimal fee = pricingService.calculate(
                t.getVehicle().getType(),
                Duration.between(t.getEntryTime(), now));

        Payment p = Payment.builder()
                .ticket(t)
                .amount(fee)
                .method(method)
                .status(PaymentStatus.SUCCESS)        // demo: assume gateway succeeds
                .gatewayRef("MOCK-" + UUID.randomUUID())
                .paidAt(now)
                .build();
        paymentRepo.save(p);

        t.setExitTime(now);
        t.setAmount(fee);
        t.setStatus(TicketStatus.PAID);
        t.getSpot().setOccupied(false);

        log.info("Ticket {} paid {} via {}", ticketNo, fee, method);

        return new Receipt(
                t.getTicketNo(),
                t.getVehicle().getLicensePlate(),
                t.getSpot().getCode(),
                t.getEntryTime(),
                t.getExitTime(),
                t.getAmount(),
                method
        );
    }
}
