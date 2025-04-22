package net.etfbl.indeks.model;



import jakarta.persistence.*;

@Entity
@Table(name = "Subscription")

public class Subscription {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "tutoring_offer_id")
    private Integer tutoringOfferId;

    @Column(name = "student_account_id")
    private Integer studentAccountId;


    @Column(nullable = false)
    private String status = "requested";

    @ManyToOne
    @JoinColumn(name = "tutoring_offer_id", insertable = false, updatable = false)
    private TutoringOffer tutoringOffer;

    @ManyToOne
    @JoinColumn(name = "student_account_id", insertable = false, updatable = false)
    private StudentAccount studentAccount;

    public Subscription() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(Integer tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public Integer getStudentAccountId() {
        return studentAccountId;
    }

    public void setStudentAccountId(Integer studentAccountId) {
        this.studentAccountId = studentAccountId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}