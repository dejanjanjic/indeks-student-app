package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.*;
import net.etfbl.indeks.model.TutoringOffer;
import net.etfbl.indeks.service.TutoringOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(path="api/v1/tutoringOffer")
public class TutoringOfferController
{
    private final TutoringOfferService tutoringOfferService;

    @Autowired
    public TutoringOfferController(TutoringOfferService tutoringOfferService) {
        this.tutoringOfferService = tutoringOfferService;
    }

    @GetMapping
    public ResponseEntity<List<TutoringOffer>> getTutoringOffers(){
        return ResponseEntity.ok(tutoringOfferService.getTutoringOffers());
    }

    @GetMapping(path = "{id}")
    public ResponseEntity<TutoringOffer> getTutoringOffer(@PathVariable(name = "id")Long id){
        Optional<TutoringOffer> tutoringOffer = tutoringOfferService.getTutoringOffer(id);
        if(tutoringOffer.isPresent()){
            return ResponseEntity.ok(tutoringOffer.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentAccountId}")
    public ResponseEntity<?> getTutoringOffersByStudentAccountId(@PathVariable Long studentAccountId) {
        List<TutoringOfferDTO> tutoringOffers = tutoringOfferService.getTutoringOffersByStudentAccountId(studentAccountId);

        if (tutoringOffers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "This student has no tutoring offers."));
        }

        return ResponseEntity.ok(tutoringOffers);
    }



    @PostMapping
    public ResponseEntity<TutoringOffer> registerNewTutoringOffer(@RequestBody AddTutoringOfferDTO addTutoringOfferDTO){

        System.out.println("usli u controller");

        TutoringOffer temp = tutoringOfferService.addNewTutoringOffer(addTutoringOfferDTO);
        System.out.println("ovdje smo dosli");
        if(temp != null){
            System.out.println("sve ok");
            return ResponseEntity.ok(temp);
        }else{
            System.out.println("nesto ne valja");
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).build();
        }
    }

    @DeleteMapping(path = "{id}")
    public ResponseEntity<Void> deleteTutoringOffer(@PathVariable("id")Long id){
        boolean deleted = tutoringOfferService.deleteTutoringOffer(id);
        if(deleted){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateTutoringOffer(@RequestBody UpdateTutoringOfferDTO updateTutoringOfferDTO){
        boolean updated = tutoringOfferService.updateTutoringOffer(updateTutoringOfferDTO);
        if(updated){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/averageRating")
    public ResponseEntity<Double> getAverageRatingForTutoringOffer(@PathVariable Long id) {
        Double averageRating = tutoringOfferService.getAverageRatingForTutoringOffer(id);
        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/details")
    public ResponseEntity<List<TutoringOfferDetailsDTO>> getTutoringOfferDetails() {
        List<TutoringOfferDetailsDTO> tutoringOfferDetails = tutoringOfferService.getTutoringOfferDetails();



        // Otherwise, return 200 OK with the list of details
        return ResponseEntity.ok(tutoringOfferDetails);
    }


    // Endpoint to get tutoring offer details with reviews by tutoring offer ID
    @GetMapping("/{tutoringOfferId}/with-reviews")
    public ResponseEntity<TutoringOfferWithReviewsDTO> getTutoringOfferWithReviewsById(@PathVariable long tutoringOfferId) {
        TutoringOfferWithReviewsDTO tutoringOfferDetails = tutoringOfferService.getTutoringOfferWithReviewsById(tutoringOfferId);

        // If no tutoring offer found, return 404 not found
        if (tutoringOfferDetails == null) {
            return ResponseEntity.noContent().build();
        }

        // Otherwise, return 200 OK with the tutoring offer details
        return ResponseEntity.ok(tutoringOfferDetails);
    }

    @DeleteMapping("/{tutoringOfferId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReviewFromTutoringOffer(
            @PathVariable Long tutoringOfferId,
            @PathVariable Long reviewId
    ) {
        boolean deleted = tutoringOfferService.deleteReviewFromTutoringOffer(tutoringOfferId, reviewId);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
