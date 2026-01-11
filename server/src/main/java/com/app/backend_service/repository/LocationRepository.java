package com.app.backend_service.repository;

import com.app.backend_service.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByTip(Location.Tip tip);
    List<Location> findByOras(String oras);
}
