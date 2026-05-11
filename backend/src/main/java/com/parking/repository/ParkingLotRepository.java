package com.parking.repository;

import com.parking.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {

    @Query("SELECT DISTINCT p.city FROM ParkingLot p ORDER BY p.city")
    List<String> findDistinctCities();

    List<ParkingLot> findByCityOrderByNameAsc(String city);
}
