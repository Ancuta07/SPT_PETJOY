package com.app.backend_service.service;

import com.app.backend_service.model.Appointment;
import com.app.backend_service.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public List<Appointment> getByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Appointment create(Appointment appointment) {
        return repository.save(appointment);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public boolean isAvailable(String clinica, String dataOraStr) {
        try {
            // Parse ISO 8601 string cu timezone (Z = UTC)
            Instant instant = Instant.parse(dataOraStr);
            LocalDateTime dataOra = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
            LocalDateTime dataOraTruncated = dataOra.truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
            
            System.out.println("=== Verificare disponibilitate ===");
            System.out.println("Clinica: " + clinica);
            System.out.println("Data/Ora cerută (UTC): " + dataOraStr);
            System.out.println("Data/Ora locală: " + dataOraTruncated);
            
            List<Appointment> appointments = repository.findByClinica(clinica);
            System.out.println("Număr programări la această clinică: " + appointments.size());
            
            if (appointments.isEmpty()) {
                System.out.println("Nu există programări -> DISPONIBIL");
                return true;
            }
            
            // Verificăm dacă există o programare în interval de ±30 minute
            LocalDateTime start = dataOraTruncated.minusMinutes(30);
            LocalDateTime end = dataOraTruncated.plusMinutes(30);
            
            for (Appointment app : appointments) {
                LocalDateTime appTime = app.getDataOra().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
                System.out.println("Programare existentă: " + appTime + " (ID: " + app.getId() + ")");
                
                if (!appTime.isBefore(start) && !appTime.isAfter(end)) {
                    System.out.println("CONFLICT: Programarea " + app.getId() + " se suprapune!");
                    return false;
                }
            }
            
            System.out.println("Niciun conflict găsit -> DISPONIBIL");
            return true;
        } catch (Exception e) {
            System.err.println("Eroare la verificarea disponibilității: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
