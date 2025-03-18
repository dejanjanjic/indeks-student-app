package net.etfbl.indeks.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table()
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private LocalDateTime dateTime;

    private double rating;

    @ManyToOne
    @JoinColumn(name = "tutoringOfferId")
    @JsonBackReference
    private TutoringOffer tutoringOffer;


    @ManyToOne
    @JoinColumn(name = "studentAccountId")
    @JsonBackReference
    private StudentAccount studentAccount;

    public Review() {}

    public Review(String comment, LocalDateTime dateTime, TutoringOffer tutoringOffer,StudentAccount studentAccount,double rating) {
        this.comment = comment;
        this.dateTime = dateTime;
        this.tutoringOffer = tutoringOffer;
        this.studentAccount = studentAccount;
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

    public TutoringOffer getTutoringOffer() {
        return tutoringOffer;
    }

    public void setTutoringOffer(TutoringOffer tutoringOffer) {
        this.tutoringOffer = tutoringOffer;
    }

    public StudentAccount getStudentAccount() {
        return studentAccount;
    }

    public void setStudentAccount(StudentAccount studentAccount) {
        this.studentAccount = studentAccount;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", comment='" + comment + '\'' +
                ", dateTime=" + dateTime +
                ", tutoringOffer=" + tutoringOffer +
                ", studentAccount="+ studentAccount +
                '}';
    }
}
