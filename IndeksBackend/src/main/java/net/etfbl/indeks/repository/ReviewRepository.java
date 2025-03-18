package net.etfbl.indeks.repository;

import net.etfbl.indeks.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository  extends JpaRepository<Review, Long> {
    List<Review> findByTutoringOfferId(long tutoringOfferId);
}
