package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.BlockedAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockedAccountRepository extends JpaRepository<BlockedAccount, Long> {
    List<BlockedAccount> findByUserAccountId(Long userId);
    void deleteByUserAccountIdAndBlockedUserId(Long userId, Long blockedUserId);

    boolean existsByUserAccountIdAndBlockedUserId(Long userId, Long otherUserId);
}
