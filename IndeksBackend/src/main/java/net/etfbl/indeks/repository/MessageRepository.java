package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByGroupChatIdOrderByTimeAsc(Long groupChatId);
}
