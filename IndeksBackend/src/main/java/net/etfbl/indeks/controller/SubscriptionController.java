package net.etfbl.indeks.controller;


import lombok.RequiredArgsConstructor;
import net.etfbl.indeks.dto.SubscriptionDTO;
import net.etfbl.indeks.dto.SubscriptionRequestDTO;
import net.etfbl.indeks.model.Subscription;
import net.etfbl.indeks.service.SubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        List<Subscription> a =subscriptionService.getAllSubscriptions();
        return ResponseEntity.ok(a);
    }
    @GetMapping("/dto")
    public ResponseEntity<List<SubscriptionDTO>> getAllSubscriptionsDTO() {
        List<SubscriptionDTO> a =subscriptionService.getAllSubscriptionsAsDTO();
        return ResponseEntity.ok(a);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscription(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Subscription> getSubscriptionByOfferAndStudent(
            @RequestParam Integer tutoringOfferId,
            @RequestParam Integer studentAccountId) {
        return ResponseEntity.ok(
                subscriptionService.getSubscriptionByOfferAndStudent(tutoringOfferId, studentAccountId));
    }

    @GetMapping("/tutoring-offer/{tutoringOfferId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByTutoringOffer(
            @PathVariable Integer tutoringOfferId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByTutoringOffer(tutoringOfferId));
    }

    @GetMapping("/student/{studentAccountId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByStudent(
            @PathVariable Integer studentAccountId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByStudent(studentAccountId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody SubscriptionRequestDTO request) {
        return new ResponseEntity<>(
                subscriptionService.createSubscription(request.getTutoringOfferId(), request.getStudentAccountId()),
                HttpStatus.CREATED);
    }
    @PutMapping("/accept")
    public ResponseEntity<Subscription> accept(@RequestParam Long id) {
        return  ResponseEntity.ok(subscriptionService.accept(id));
    }
    @PutMapping("/reject")
    public ResponseEntity<Subscription> reject(@RequestParam Long id) {
        return  ResponseEntity.ok(subscriptionService.reject(id));
    }
//    @PutMapping("/{id}/status")
//    public ResponseEntity<Subscription> updateSubscriptionStatus(
//            @PathVariable Integer id,
//            @RequestBody StatusUpdateRequest request) {
//        return ResponseEntity.ok(
//                subscriptionService.updateSubscriptionStatus(id, request.getStatus()));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }




}