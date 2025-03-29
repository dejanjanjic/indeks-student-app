package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.ElementaryGroupChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ElementaryGroupChatMemberRepository extends JpaRepository<ElementaryGroupChatMember, Long> {
    boolean existsByElementaryGroupChat_IdAndStudentAccount_Id(Long elementaryGroupChatId, Long studentAccountId);

    @Transactional
    void deleteByElementaryGroupChat_IdAndStudentAccount_Id(Long elementaryGroupChatId, Long studentAccountId);

    List<ElementaryGroupChatMember> findByElementaryGroupChat_Id(Long elementaryGroupChatId);
}
