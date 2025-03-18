package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.StudentAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface StudentAccountRepository extends JpaRepository<StudentAccount, Long>{
    @Query("SELECT sa FROM StudentAccount sa JOIN sa.userAccount ua JOIN ua.account a WHERE a.email = :email")
    Optional<StudentAccount> findByEmail(@Param("email") String email);
}
