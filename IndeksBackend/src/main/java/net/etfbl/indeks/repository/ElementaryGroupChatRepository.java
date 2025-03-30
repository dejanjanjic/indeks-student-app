package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.PrivateGroupChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ElementaryGroupChatRepository extends JpaRepository<ElementaryGroupChat,Long>
{
    List<ElementaryGroupChat> findAllByGroupChat_NameContains(String keyword);
}
