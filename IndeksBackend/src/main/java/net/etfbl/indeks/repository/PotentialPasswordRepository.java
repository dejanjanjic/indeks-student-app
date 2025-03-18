package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.PotentialPassword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PotentialPasswordRepository extends JpaRepository<PotentialPassword, Long> {
    Optional<PotentialPassword> findByAccountId(Long accountId);

    void deleteByAccountId(Long accountId);
}