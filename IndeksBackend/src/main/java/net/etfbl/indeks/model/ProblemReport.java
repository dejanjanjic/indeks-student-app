package net.etfbl.indeks.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table
public class ProblemReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reason;
    private LocalDateTime time;
    private Integer type;

    @ManyToOne
    @JoinColumn(name = "reviewId", referencedColumnName = "id")
    private Review review;

    @ManyToOne
    @JoinColumn(name = "materialId", referencedColumnName = "id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "reporterId", referencedColumnName = "id")
    private UserAccount reporter;

    @ManyToOne
    @JoinColumn(name = "reportedId", referencedColumnName = "id")
    private UserAccount reported;

    public ProblemReport() {
        
    }

    public ProblemReport(String reason, int type, Review review, Material material,
                         AdminAccount adminAccount, UserAccount reporter, UserAccount reported) {
        this.reason = reason;
        this.type = type;
        this.review = review;
        this.material = material;
        this.reporter = reporter;
        this.reported = reported;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public UserAccount getReporter() {
        return reporter;
    }

    public void setReporter(UserAccount reporter) {
        this.reporter = reporter;
    }

    public UserAccount getReported() {
        return reported;
    }

    public void setReported(UserAccount reported) {
        this.reported = reported;
    }
}
