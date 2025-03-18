package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findBySubjectId(Long subjectId);
    List<Material> findByownerAccountId(Long ownerAccountId);
}
