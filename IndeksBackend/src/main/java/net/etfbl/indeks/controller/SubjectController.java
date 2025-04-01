package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddSubjectDTO;
import net.etfbl.indeks.dto.GetSubjectDTO;
import net.etfbl.indeks.model.Subject;
import net.etfbl.indeks.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/subject")
public class SubjectController {
    private final SubjectService subjectService;

    @Autowired
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // Get all subjects
    @GetMapping
    public ResponseEntity<List<GetSubjectDTO>> getSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    // Get subject by ID
    @GetMapping(path = "{id}")
    public ResponseEntity<GetSubjectDTO> getSubject(@PathVariable(name = "id") Long id) {
        GetSubjectDTO subjectDTO = subjectService.getSubjectById(id);
        if (subjectDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subjectDTO);
    }

    // Get subjects by year
    @GetMapping(path = "/year/{year}")
    public ResponseEntity<List<GetSubjectDTO>> getSubjectsByYear(@PathVariable int year) {
        System.out.println("sxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        List<GetSubjectDTO> subjects = subjectService.getSubjectsByYear(year);
        return ResponseEntity.ok(subjects);
    }

    // Add new subject
    @PostMapping
    public ResponseEntity<Subject> registerNewSubject(@RequestBody AddSubjectDTO addSubjectDTO) {
        Subject newSubject = subjectService.addNewSubject(addSubjectDTO);
        return ResponseEntity.ok(newSubject);
    }

    // Delete subject
    @DeleteMapping(path = "{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        boolean deleted = subjectService.deleteSubject(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update subject
    @PutMapping
    public ResponseEntity<Void> updateSubject(@RequestBody Subject subject) {
        boolean updated = subjectService.updateSubject(subject);
        if (updated) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
