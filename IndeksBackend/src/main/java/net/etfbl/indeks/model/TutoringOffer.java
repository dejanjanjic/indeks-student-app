package net.etfbl.indeks.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Iterator;
import java.util.List;

@Entity
@Table()
public class TutoringOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;


    @ManyToOne
    @JoinColumn(name = "subjectId")
    @JsonBackReference
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "tutorAccountId")
    @JsonBackReference
    private TutorAccount tutorAccount;

    @OneToMany(mappedBy = "tutoringOffer" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Review> reviews;


    public TutoringOffer() {}

    public TutoringOffer(String description, Subject subject, TutorAccount tutorAccount) {
        this.description = description;
        this.subject = subject;
        this.tutorAccount = tutorAccount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public TutorAccount getTutorAccount() {
        return tutorAccount;
    }

    public boolean removeReview(Long reviewId) {
        if (this.reviews != null) {
            Iterator<Review> iterator = this.reviews.iterator();
            while (iterator.hasNext()) {
                Review review = iterator.next();
                if (review.getId().equals(reviewId)) {
                    iterator.remove();
                    return true;
                }
            }
        }
        return false;
    }
    public void setTutorAccount(TutorAccount tutorAccount) {
        this.tutorAccount = tutorAccount;
    }

    @Override
    public String toString() {
        return "TutoringOffer{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", subject=" + subject +
                ", tutorAccount=" + tutorAccount +
                '}';
    }
}

