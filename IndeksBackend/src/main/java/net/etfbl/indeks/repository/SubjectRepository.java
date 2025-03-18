package net.etfbl.indeks.repository;


import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByYear(int year);
}
