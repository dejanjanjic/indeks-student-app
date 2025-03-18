package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.AccountHasAccessToMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountHasAccessToMaterialRepository extends JpaRepository<AccountHasAccessToMaterial, Long> {
}
