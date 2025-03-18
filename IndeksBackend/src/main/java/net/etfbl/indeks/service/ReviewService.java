package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import net.etfbl.indeks.dto.AddPrivateGroupChatDTO;
import net.etfbl.indeks.dto.AddReviewDTO;
import net.etfbl.indeks.dto.TutoringOfferWithReviewsDTO;
import net.etfbl.indeks.dto.UpdateReviewDTO;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.ReviewRepository;
import net.etfbl.indeks.repository.StudentAccountRepository;
import net.etfbl.indeks.repository.TutoringOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService
{
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository){
        this.reviewRepository=reviewRepository;
    }

    public List<Review> getReviews() {
        return reviewRepository.findAll();
    }
    public Optional<Review> getReview(Long id) {
        return reviewRepository.findById(id);
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public TutoringOfferWithReviewsDTO.ReviewDTO addNewReview(AddReviewDTO addReviewDTO)
    {
        // Find the TutoringOffer by its ID
        TutoringOffer tutoringOffer = entityManager.find(TutoringOffer.class, addReviewDTO.getTutoringOfferId());
        if (tutoringOffer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutoring Offer not found");
        }

        // Find the StudentAccount by its ID
        StudentAccount studentAccount = entityManager.find(StudentAccount.class, addReviewDTO.getStudentAccountId());
        if (studentAccount == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student Account not found");
        }

        // Create a new Review entity
        Review newReview = new Review(
                addReviewDTO.getComment(),
                addReviewDTO.getDateTime(),
                tutoringOffer,
                studentAccount,
                addReviewDTO.getRating()
        );

        // Persist the new review entity to the database
        entityManager.persist(newReview);

        // Map the Review entity to ReviewDTO and return it
        TutoringOfferWithReviewsDTO.ReviewDTO reviewDTO = new TutoringOfferWithReviewsDTO.ReviewDTO(
                newReview.getId(),
                studentAccount.getUserAccount().getFirstName(), // Assuming `StudentAccount` has a `getName()` method
                newReview.getComment(),
                newReview.getRating()
        );

        return reviewDTO;
    }


    public boolean deleteReview(Long id) {
        boolean exists = reviewRepository.existsById(id);
        if(!exists){
            return false;
        }
        reviewRepository.deleteById(id);
        return true;
    }


    @Transactional
    public boolean updateReview(UpdateReviewDTO updateReviewDTO) {
        Optional<Review> temp = reviewRepository.findById(updateReviewDTO.getId());

        if (temp.isEmpty()) {
            return false;
        }

        Review existingReview = temp.get();
        existingReview.setComment(updateReviewDTO.getComment());
        existingReview.setDateTime(updateReviewDTO.getDateTime());
        existingReview.setRating(updateReviewDTO.getRating());

        reviewRepository.save(existingReview);

        return true;
    }

}
