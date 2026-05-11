package com.parking.repository;

import com.parking.entity.ParkingSpot;
import com.parking.entity.SpotType;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
    @Query("""
        SELECT s FROM ParkingSpot s
        WHERE s.type = :type AND s.occupied = false
          AND NOT EXISTS (SELECT 1 FROM Reservation r WHERE r.spot = s AND r.status = 'ACTIVE')
        ORDER BY s.floor.level DESC, s.code ASC
        """)
    List<ParkingSpot> findFreeForUpdate(@Param("type") SpotType type);

    default Optional<ParkingSpot> findFirstFreeForUpdate(SpotType type) {
        return findFreeForUpdate(type).stream().findFirst();
    }

    long countByTypeAndOccupied(SpotType type, boolean occupied);

    long countByFloor_IdAndTypeAndOccupied(Long floorId, SpotType type, boolean occupied);

    List<ParkingSpot> findByFloor_IdOrderByCodeAsc(Long floorId);
}
