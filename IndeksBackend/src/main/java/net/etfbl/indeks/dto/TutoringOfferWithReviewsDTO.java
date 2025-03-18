package net.etfbl.indeks.dto;

import java.util.List;

public class TutoringOfferWithReviewsDTO {
    private String subjectName;
    private String instructorName;
    private String description;
    private long tutoringOfferId;
    private List<ReviewDTO> reviews;

    // Constructor, Getters, and Setters
    public TutoringOfferWithReviewsDTO(String subjectName, String instructorName, String description, long tutoringOfferId, List<ReviewDTO> reviews) {
        this.subjectName = subjectName;
        this.instructorName = instructorName;
        this.description = description;
        this.tutoringOfferId = tutoringOfferId;
        this.reviews = reviews;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(long tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public List<ReviewDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews;
    }

    // Nested ReviewDTO for reviews
    public static class ReviewDTO {

        private Long id;
        private String reviewerName;
        private String description;
        private Double grade;

        public ReviewDTO(Long id,String reviewerName, String description, Double grade) {
            this.id=id;
            this.reviewerName = reviewerName;
            this.description = description;
            this.grade = grade;
        }

        public String getReviewerName() {
            return reviewerName;
        }

        public void setReviewerName(String reviewerName) {
            this.reviewerName = reviewerName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Double getGrade() {
            return grade;
        }

        public void setGrade(Double grade) {
            this.grade = grade;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
}
