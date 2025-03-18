package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.PrivateGroupChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrivateGroupChatMemberRepository extends JpaRepository<PrivateGroupChatMember, Long> {
    List<PrivateGroupChatMember> findByPrivateGroupChat_Id(Long privateGroupChatId);

    boolean existsByPrivateGroupChat_IdAndUserAccount_Id(Long privateGroupChatId, Long userAccountId);

    @Transactional
    void deleteByPrivateGroupChat_IdAndUserAccount_Id(Long privateGroupChatId, Long userAccountId);
}
