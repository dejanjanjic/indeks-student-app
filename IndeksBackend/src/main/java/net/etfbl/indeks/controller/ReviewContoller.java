package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddPrivateGroupChatDTO;
import net.etfbl.indeks.dto.AddReviewDTO;
import net.etfbl.indeks.dto.TutoringOfferWithReviewsDTO;
import net.etfbl.indeks.dto.UpdateReviewDTO;
import net.etfbl.indeks.model.PrivateGroupChat;
import net.etfbl.indeks.model.Review;
import net.etfbl.indeks.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/v1/review")
public class ReviewContoller
{
    private final ReviewService reviewService;

    @Autowired
    public ReviewContoller(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(){
        return ResponseEntity.ok(reviewService.getReviews());
    }

    @GetMapping(path = "{id}")
    public ResponseEntity<Review> getReview(@PathVariable(name = "id")Long id){
        Optional<Review> review = reviewService.getReview(id);
        if(review.isPresent()){
            return ResponseEntity.ok(review.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<TutoringOfferWithReviewsDTO.ReviewDTO> registerNewReview(@RequestBody AddReviewDTO addReviewDTO) {
        // Call the service method to add the new review and get a ReviewDTO
        TutoringOfferWithReviewsDTO.ReviewDTO reviewDTO = reviewService.addNewReview(addReviewDTO);

        // Check if the ReviewDTO is not null
        if (reviewDTO != null) {
            // Return a successful response with the ReviewDTO
            return ResponseEntity.ok(reviewDTO);
        } else {
            // Return a conflict status if something goes wrong
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).build();
        }
    }


    @DeleteMapping(path = "{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id")Long id){
        boolean deleted = reviewService.deleteReview(id);
        if(deleted){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateReview(@RequestBody UpdateReviewDTO updateReviewDTO){
        boolean updated = reviewService.updateReview(updateReviewDTO);
        if(updated){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
