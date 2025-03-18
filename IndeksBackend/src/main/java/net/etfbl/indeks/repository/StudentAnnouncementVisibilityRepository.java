package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.StudentAnnouncementVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnnouncementVisibilityRepository extends JpaRepository<StudentAnnouncementVisibility, Long> {
    List<StudentAnnouncementVisibility> findByStudentAccountId(Long studentAccountId);
}
