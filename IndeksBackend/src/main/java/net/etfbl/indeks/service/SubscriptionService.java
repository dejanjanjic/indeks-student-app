package net.etfbl.indeks.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.etfbl.indeks.dto.SubscriptionDTO;
import net.etfbl.indeks.model.Subscription;
import net.etfbl.indeks.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final Random random = new Random();

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
    public List<SubscriptionDTO> getAllSubscriptionsAsDTO() {
        return subscriptionRepository.findAll().stream()
                .map(subscription -> {
                    SubscriptionDTO dto = new SubscriptionDTO();
                    dto.setId(subscription.getId());
                    dto.setStudent(subscription.getStudentAccount().getUserAccount().getFirstName()+subscription.getStudentAccount().getUserAccount().getLastName()); // Adjust based on your StudentAccount properties
                    dto.setRequest(subscription.getStatus().equals("requested"));
                    dto.setSubject(subscription.getTutoringOffer().getSubject().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public Subscription getSubscription(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found with id: " + id));
    }

    public Subscription getSubscriptionByOfferAndStudent(Integer tutoringOfferId, Integer studentAccountId) {
        return subscriptionRepository.findByTutoringOfferIdAndStudentAccountId(tutoringOfferId, studentAccountId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Subscription not found for tutoring offer ID: " + tutoringOfferId +
                                " and student ID: " + studentAccountId));
    }

    public List<Subscription> getSubscriptionsByTutoringOffer(Integer tutoringOfferId) {
        return subscriptionRepository.findByTutoringOfferId(tutoringOfferId);
    }

    public List<Subscription> getSubscriptionsByStudent(Integer studentAccountId) {
        return subscriptionRepository.findByStudentAccountId(studentAccountId);
    }

    public List<Subscription> getSubscriptionsByStatus(String status) {
        return subscriptionRepository.findByStatus(status);
    }
    public Subscription accept(Long id) {
        Optional<Subscription> a= subscriptionRepository.findById(id);
        if(a.get()!=null)
        {
            Subscription b = a.get();
            b.setStatus("accepted");
            return subscriptionRepository.save(b);
        }
        return null;
    }
    public Subscription reject(Long id) {
        Optional<Subscription> a= subscriptionRepository.findById(id);
        if(a.get()!=null)
        {
            Subscription b = a.get();
            b.setStatus("rejected");
            return subscriptionRepository.save(b);
        }
        return null;
    }
    @Transactional
    public Subscription createSubscription(Integer tutoringOfferId, Integer studentAccountId) {
        // Check if subscription already exists
        subscriptionRepository.findByTutoringOfferIdAndStudentAccountId(tutoringOfferId, studentAccountId)
                .ifPresent(s -> {
                    throw new IllegalStateException("Subscription already exists");
                });

        // Generate a unique ID (in a real application, consider using a sequence or auto-increment)
        Long id = Long.valueOf(generateUniqueId());

        Subscription subscription = new Subscription();
        subscription.setId(id);
        subscription.setTutoringOfferId(tutoringOfferId);
        subscription.setStudentAccountId(studentAccountId);
        subscription.setStatus("requested");
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public Subscription updateSubscriptionStatus(Long id, String status) {
        Subscription subscription = getSubscription(id);
        subscription.setStatus(status);
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public void deleteSubscription(Long id) {
        Subscription subscription = getSubscription(id);
        subscriptionRepository.delete(subscription);
    }

    // Helper method to generate a unique ID
    // In production, consider using database sequences or auto-increment
    private Integer generateUniqueId() {
        // Simple implementation - in production use a better approach
        return Math.abs(random.nextInt());
    }
}