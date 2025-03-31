package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<GroupChat, Long> {
    Optional<GroupChat> findByName(String GroupName);

    boolean existsGroupChatByName(String name);
}
