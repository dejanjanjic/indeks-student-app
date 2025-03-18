package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddStudentAnnouncementVisibilityDTO;
import net.etfbl.indeks.model.StudentAnnouncementVisibility;
import net.etfbl.indeks.service.StudentAnnouncementVisibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/announcement-visibility")
public class StudentAnnouncementVisibilityController {

    private final StudentAnnouncementVisibilityService visibilityService;

    @Autowired
    public StudentAnnouncementVisibilityController(StudentAnnouncementVisibilityService visibilityService) {
        this.visibilityService = visibilityService;
    }

    @PostMapping
    public ResponseEntity<StudentAnnouncementVisibility> addVisibility(@RequestBody AddStudentAnnouncementVisibilityDTO dto) {
        StudentAnnouncementVisibility newVisibility = visibilityService.addNewVisibility(dto);
        return new ResponseEntity<>(newVisibility, HttpStatus.CREATED);
    }

    @GetMapping("/{studentAccountId}")
    public ResponseEntity<StudentAnnouncementVisibility> getVisibility(@PathVariable Long studentAccountId) {
        Optional<StudentAnnouncementVisibility> visibility = visibilityService.getVisibility(studentAccountId);
        return visibility.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping
    public ResponseEntity<Void> updateVisibility(@RequestBody AddStudentAnnouncementVisibilityDTO dto) {
        boolean updated = visibilityService.updateVisibility(dto);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{studentAccountId}")
    public ResponseEntity<Void> deleteVisibility(@PathVariable Long studentAccountId) {
        boolean deleted = visibilityService.deleteVisibility(studentAccountId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
