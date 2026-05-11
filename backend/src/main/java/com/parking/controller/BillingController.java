package com.parking.controller;

import com.parking.dto.ParkingDtos.*;
import com.parking.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/tickets/{ticketNo}/pay")
    public Receipt pay(@PathVariable String ticketNo, @Valid @RequestBody ExitRequest req) {
        return billingService.payAndExit(ticketNo, req.method());
    }
}
