package net.etfbl.indeks.dto;

public class TutoringOfferDTO {
    private Long tutoringOfferId;
    private String description;
    private String subjectName;

    private Double averageRating;

    public TutoringOfferDTO(Long tutoringOfferId, String description, String subjectName, Double averageRating) {
        this.tutoringOfferId = tutoringOfferId;
        this.description = description;
        this.subjectName = subjectName;
        this.averageRating = averageRating;
    }

    // Getters and setters
    public Long getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(Long tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
