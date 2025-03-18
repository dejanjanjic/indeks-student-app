package net.etfbl.indeks.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int year;

    @OneToMany(mappedBy = "subject")
    @JsonManagedReference
    private List<TutoringOffer> tutoringOffers;

    public Subject() {}

    public Subject(String name, int year) {
        this.name = name;
        this.year = year;
    }

    public List<TutoringOffer> getTutoringOffers() {
        return tutoringOffers;
    }

    public void setTutoringOffers(List<TutoringOffer> tutoringOffers) {
        this.tutoringOffers = tutoringOffers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return "Subject{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", year=" + year +
                '}';
    }
}
