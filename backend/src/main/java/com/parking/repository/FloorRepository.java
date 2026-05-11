package com.parking.repository;

import com.parking.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findAllByOrderByLevelDesc();
}
