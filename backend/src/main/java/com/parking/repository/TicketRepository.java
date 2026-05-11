package com.parking.repository;

import com.parking.entity.Ticket;
import com.parking.entity.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNo(String ticketNo);
    Page<Ticket> findAllByOrderByEntryTimeDesc(Pageable pageable);
    List<Ticket> findByStatus(TicketStatus status);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0) FROM Ticket t
        WHERE t.status = 'PAID' AND t.exitTime BETWEEN :from AND :to
        """)
    BigDecimal sumRevenueBetween(@Param("from") Instant from, @Param("to") Instant to);

    long countByStatus(TicketStatus status);
}
