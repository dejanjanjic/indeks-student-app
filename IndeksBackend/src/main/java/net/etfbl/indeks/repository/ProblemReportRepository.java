package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.ProblemReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProblemReportRepository extends JpaRepository<ProblemReport, Long> {
    List<ProblemReport> findByType(Integer type); // Correct return type
}
