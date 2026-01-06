package com.app.backend_service.service;

import com.app.backend_service.model.Appointment;
import com.app.backend_service.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Creează o programare nouă
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Găsește toate programările
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Găsește programările pentru un email
    public List<Appointment> getAppointmentsByEmail(String email) {
        return appointmentRepository.findByEmail(email);
    }

    // Găsește o programare după ID
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // Șterge o programare
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
