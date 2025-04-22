package net.etfbl.indeks.repository;


import net.etfbl.indeks.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByTutoringOfferId(Integer tutoringOfferId);

    List<Subscription> findByStudentAccountId(Integer studentAccountId);

    List<Subscription> findByStatus(String status);

    Optional<Subscription> findByTutoringOfferIdAndStudentAccountId(Integer tutoringOfferId, Integer studentAccountId);
}