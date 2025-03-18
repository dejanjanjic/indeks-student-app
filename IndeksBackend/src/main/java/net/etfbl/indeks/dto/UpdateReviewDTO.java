package net.etfbl.indeks.dto;

import java.time.LocalDateTime;

public class UpdateReviewDTO {

    private Long id;
    private String comment;
    private LocalDateTime dateTime;
    private  double rating;

    public UpdateReviewDTO() {}

    public UpdateReviewDTO(Long id, String comment, LocalDateTime dateTime,double rating) {
        this.id = id;
        this.comment = comment;
        this.dateTime = dateTime;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
