package net.etfbl.indeks.repository;

import net.etfbl.indeks.dto.UserAccountDetailsDTO;
import net.etfbl.indeks.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    @Query("SELECT u FROM UserAccount u WHERE u.account.email = :email")
    Optional<UserAccount> findByEmail(String email);

    @Query("SELECT new net.etfbl.indeks.dto.UserAccountDetailsDTO(ua.id, ua.firstName, ua.lastName, ua.active, a.email, a.role) " +
            "FROM UserAccount ua JOIN ua.account a")
    List<UserAccountDetailsDTO> findAllUserAccountDetails();
}

