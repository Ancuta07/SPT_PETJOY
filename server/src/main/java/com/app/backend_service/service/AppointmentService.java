package com.app.backend_service.service;

import com.app.backend_service.model.Appointment;
import com.app.backend_service.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

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
}
