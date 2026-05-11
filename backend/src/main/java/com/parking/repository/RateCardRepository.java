package com.parking.repository;

import com.parking.entity.RateCard;
import com.parking.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RateCardRepository extends JpaRepository<RateCard, Long> {
    Optional<RateCard> findByVehicleType(VehicleType vehicleType);
}
