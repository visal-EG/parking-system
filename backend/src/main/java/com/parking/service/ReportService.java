package com.parking.service;

import com.parking.dto.ReportDtos.*;
import com.parking.entity.TicketStatus;
import com.parking.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final TicketRepository ticketRepo;

    public DashboardResponse dashboard() {
        ZoneId z = ZoneOffset.UTC;
        Instant todayStart = LocalDate.now(z).atStartOfDay(z).toInstant();
        Instant monthStart = LocalDate.now(z).withDayOfMonth(1).atStartOfDay(z).toInstant();
        Instant now = Instant.now();

        BigDecimal today = nz(ticketRepo.sumRevenueBetween(todayStart, now));
        BigDecimal month = nz(ticketRepo.sumRevenueBetween(monthStart, now));

        return new DashboardResponse(
                ticketRepo.countByStatus(TicketStatus.ACTIVE),
                ticketRepo.countByStatus(TicketStatus.PAID),
                today,
                month
        );
    }

    public RevenueResponse revenue(LocalDate from, LocalDate to) {
        ZoneId z = ZoneOffset.UTC;
        List<RevenueRow> rows = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        LocalDate d = from;
        while (!d.isAfter(to)) {
            Instant s = d.atStartOfDay(z).toInstant();
            Instant e = d.plusDays(1).atStartOfDay(z).toInstant();
            BigDecimal amt = nz(ticketRepo.sumRevenueBetween(s, e));
            rows.add(new RevenueRow(d, amt));
            total = total.add(amt);
            d = d.plusDays(1);
        }
        return new RevenueResponse(total, rows);
    }

    private BigDecimal nz(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }
}
