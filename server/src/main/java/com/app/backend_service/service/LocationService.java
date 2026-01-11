package com.app.backend_service.service;

import com.app.backend_service.model.Location;
import com.app.backend_service.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository repository;

    public LocationService(LocationRepository repository) {
        this.repository = repository;
    }

    public List<Location> getAll() {
        return repository.findAll();
    }

    public List<Location> getByTip(Location.Tip tip) {
        return repository.findByTip(tip);
    }

    public List<Location> getByOras(String oras) {
        return repository.findByOras(oras);
    }

    public Location create(Location location) {
        return repository.save(location);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
