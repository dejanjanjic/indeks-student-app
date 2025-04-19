package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.TutorAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorAccountRepository extends JpaRepository<TutorAccount, Long> {
    @Query("SELECT ta FROM TutorAccount ta JOIN ta.userAccount ua JOIN ua.account a WHERE a.email = :email")
    Optional<TutorAccount> findByEmail(@Param("email") String email);

    @Query("SELECT ta FROM TutorAccount ta WHERE ta.userAccount.firstName = :firstName AND ta.userAccount.lastName = :lastName")
    Optional<TutorAccount> findByFirstAndLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);


}
