package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddSubjectDTO;
import net.etfbl.indeks.dto.GetSubjectDTO;
import net.etfbl.indeks.model.Subject;
import net.etfbl.indeks.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Fetch all subjects
    public List<GetSubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(subject -> new GetSubjectDTO(subject.getId(), subject.getName(), subject.getYear()))
                .collect(Collectors.toList());
    }

    // Fetch subject by ID
    public GetSubjectDTO getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .map(subject -> new GetSubjectDTO(subject.getId(), subject.getName(), subject.getYear()))
                .orElse(null);
    }

    // Fetch subjects by year
    public List<GetSubjectDTO> getSubjectsByYear(int year) {
        return subjectRepository.findByYear(year).stream()
                .map(subject -> new GetSubjectDTO(subject.getId(), subject.getName(), subject.getYear()))
                .collect(Collectors.toList());
    }

    // Add new subject
    public Subject addNewSubject(AddSubjectDTO addSubjectDTO) {
        Subject subject = new Subject(addSubjectDTO.getName(), addSubjectDTO.getYear());
        return subjectRepository.save(subject);
    }

    // Delete subject by ID
    public boolean deleteSubject(Long id) {
        boolean exists = subjectRepository.existsById(id);
        if (!exists) {
            return false;
        }
        subjectRepository.deleteById(id);
        return true;
    }

    // Update subject
    public boolean updateSubject(Subject subject) {
        Optional<Subject> temp = subjectRepository.findById(subject.getId());
        if (temp.isEmpty()) {
            return false;
        }
        temp.get().setName(subject.getName());
        temp.get().setYear(subject.getYear());
        return true;
    }
}
