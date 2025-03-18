package net.etfbl.indeks.repository;


import net.etfbl.indeks.model.TutoringOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutoringOfferRepository  extends JpaRepository<TutoringOffer, Long> {
    List<TutoringOffer> findByTutorAccountId(Long studentAccountId);
}
