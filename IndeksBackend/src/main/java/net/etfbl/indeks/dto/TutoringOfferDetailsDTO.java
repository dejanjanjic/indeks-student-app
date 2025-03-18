package net.etfbl.indeks.dto;

public class TutoringOfferDetailsDTO {
    private String instructorName;  // Student's name (acting as the instructor)
    private String subjectName;
    private long tutoringOfferId;
    private Double averageRating;  // Changed to Double

    // Constructor, Getters, and Setters
    public TutoringOfferDetailsDTO(String instructorName, String subjectName, long tutoringOfferId, Double averageRating) {
        this.instructorName = instructorName;
        this.subjectName = subjectName;
        this.tutoringOfferId = tutoringOfferId;
        this.averageRating = averageRating;
    }

    // Getters and Setters
    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public long getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(long tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
