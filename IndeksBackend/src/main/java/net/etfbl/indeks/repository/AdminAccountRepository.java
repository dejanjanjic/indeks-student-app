package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.AdminAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {
}
