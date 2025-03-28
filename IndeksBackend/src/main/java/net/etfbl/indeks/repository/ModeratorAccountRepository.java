package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.ModeratorAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModeratorAccountRepository extends JpaRepository<ModeratorAccount, Long> {
}