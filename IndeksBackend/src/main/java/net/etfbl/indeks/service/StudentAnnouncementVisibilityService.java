package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import net.etfbl.indeks.dto.AddStudentAnnouncementVisibilityDTO;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.model.StudentAnnouncementVisibility;
import net.etfbl.indeks.repository.StudentAnnouncementVisibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class StudentAnnouncementVisibilityService {

    private final StudentAnnouncementVisibilityRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public StudentAnnouncementVisibilityService(StudentAnnouncementVisibilityRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public StudentAnnouncementVisibility addNewVisibility(AddStudentAnnouncementVisibilityDTO dto) {

        StudentAccount studentAccount = entityManager.find(StudentAccount.class, dto.getStudentAccountId());
        if (studentAccount == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student Account not found");
        }

        StudentAnnouncementVisibility visibility = new StudentAnnouncementVisibility(
                studentAccount,
                dto.isCanSeeYear1(),
                dto.isCanSeeYear2(),
                dto.isCanSeeYear3(),
                dto.isCanSeeYear4(),
                dto.isCanSeeMaster(),
                dto.isCanSeeDoctorate()
        );

        return repository.save(visibility);
    }

    public Optional<StudentAnnouncementVisibility> getVisibility(Long studentAccountId) {

        TypedQuery<StudentAnnouncementVisibility> query = entityManager.createQuery(
                "SELECT v FROM StudentAnnouncementVisibility v WHERE v.studentAccount.id = :studentId",
                StudentAnnouncementVisibility.class);
        query.setParameter("studentId", studentAccountId);

        try {
            return Optional.of(query.getSingleResult());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean updateVisibility(AddStudentAnnouncementVisibilityDTO dto) {
        Optional<StudentAnnouncementVisibility> existingVisibility = getVisibility(dto.getStudentAccountId());

        if (existingVisibility.isEmpty()) {
            return false;
        }

        StudentAnnouncementVisibility visibility = existingVisibility.get();
        visibility.setCanSeeYear1(dto.isCanSeeYear1());
        visibility.setCanSeeYear2(dto.isCanSeeYear2());
        visibility.setCanSeeYear3(dto.isCanSeeYear3());
        visibility.setCanSeeYear4(dto.isCanSeeYear4());
        visibility.setCanSeeMaster(dto.isCanSeeMaster());
        visibility.setCanSeeDoctorate(dto.isCanSeeDoctorate());

        repository.save(visibility);
        return true;
    }

    public boolean deleteVisibility(Long studentAccountId) {
        Optional<StudentAnnouncementVisibility> visibility = getVisibility(studentAccountId);
        if (visibility.isEmpty()) {
            return false;
        }
        repository.delete(visibility.get());
        return true;
    }
}
