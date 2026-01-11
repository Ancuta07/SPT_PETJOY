package com.app.backend_service.controller;

import com.app.backend_service.model.Location;
import com.app.backend_service.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "http://localhost:5500")
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAll(
            @RequestParam(required = false) String tip,
            @RequestParam(required = false) String oras) {
        
        if (tip != null && !tip.isBlank()) {
            try {
                Location.Tip tipEnum = Location.Tip.valueOf(tip.toUpperCase());
                return ResponseEntity.ok(service.getByTip(tipEnum));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        if (oras != null && !oras.isBlank()) {
            return ResponseEntity.ok(service.getByOras(oras));
        }
        
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Location> create(@RequestBody Location location) {
        return ResponseEntity.ok(service.create(location));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la ștergere: " + e.getMessage());
        }
    }
}
