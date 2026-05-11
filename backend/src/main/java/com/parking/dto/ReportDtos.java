package com.parking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ReportDtos {
    public record RevenueRow(LocalDate date, BigDecimal amount) {}
    public record RevenueResponse(BigDecimal total, List<RevenueRow> daily) {}
    public record DashboardResponse(
            long activeTickets,
            long paidTickets,
            BigDecimal todayRevenue,
            BigDecimal monthRevenue
    ) {}
}
