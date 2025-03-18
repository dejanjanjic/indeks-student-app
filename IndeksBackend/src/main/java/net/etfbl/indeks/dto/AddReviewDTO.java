package net.etfbl.indeks.dto;


import java.time.LocalDateTime;

public class AddReviewDTO
{
    private String comment;
    private LocalDateTime dateTime;
    private Long tutoringOfferId;
    private Long studentAccountId;
    private double rating;

    public AddReviewDTO() {}

    public AddReviewDTO( String comment, LocalDateTime dateTime, Long tutoringOfferId, Long studentAccountId,double rating) {
        this.comment = comment;
        this.dateTime = dateTime;
        this.tutoringOfferId = tutoringOfferId;
        this.studentAccountId = studentAccountId;
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Long getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(Long tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public Long getStudentAccountId() {
        return studentAccountId;
    }

    public void setStudentAccountId(Long studentAccountId) {
        this.studentAccountId = studentAccountId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
