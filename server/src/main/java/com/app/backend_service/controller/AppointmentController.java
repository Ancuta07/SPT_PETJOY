package com.app.backend_service.controller;

import com.app.backend_service.model.Appointment;
import com.app.backend_service.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:5500"})
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Creează o programare nouă
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment newAppointment = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(newAppointment);
    }

    // Obține toate programările
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Obține programările pentru un email specific
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Appointment>> getAppointmentsByEmail(@PathVariable String email) {
        List<Appointment> appointments = appointmentService.getAppointmentsByEmail(email);
        return ResponseEntity.ok(appointments);
    }

    // Șterge o programare
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
