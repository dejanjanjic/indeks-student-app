package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.SingleChat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SingleChatRepository extends JpaRepository<SingleChat, Long> {
}
