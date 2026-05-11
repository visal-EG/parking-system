package com.parking.repository;

import com.parking.entity.Reservation;
import com.parking.entity.ReservationStatus;
import com.parking.entity.SpotType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser_IdAndStatus(Long userId, ReservationStatus status);

    boolean existsBySpot_IdAndStatus(Long spotId, ReservationStatus status);

    Optional<Reservation> findBySpot_IdAndStatus(Long spotId, ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.status = :status AND r.expiresAt < :now")
    List<Reservation> findExpired(@Param("status") ReservationStatus status, @Param("now") Instant now);

    @Query("""
        SELECT COUNT(r) FROM Reservation r
        WHERE r.status = 'ACTIVE' AND r.spot.floor.id = :floorId AND r.spot.type = :type
        """)
    long countActiveByFloorAndType(@Param("floorId") Long floorId, @Param("type") SpotType type);

    @Query("SELECT r.spot.id FROM Reservation r WHERE r.status = 'ACTIVE'")
    List<Long> findActiveReservedSpotIds();

    Optional<Reservation> findByTicketNo(String ticketNo);
}
