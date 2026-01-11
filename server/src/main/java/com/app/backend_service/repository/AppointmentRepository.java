package com.app.backend_service.repository;

import com.app.backend_service.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Găsește toate programările pentru un anumit email
    List<Appointment> findByEmail(String email);
    
    // Găsește toate programările pentru o anumită clinică
    List<Appointment> findByClinica(String clinica);
    
    // Verifică dacă există o programare la o anumită clinică și dată/oră
    boolean existsByClinicaAndDataOra(String clinica, LocalDateTime dataOra);
}
