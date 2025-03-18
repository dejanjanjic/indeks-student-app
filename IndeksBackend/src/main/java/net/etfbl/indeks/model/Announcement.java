package net.etfbl.indeks.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table
public class Announcement {

    @Id
    private Long id;

    private String title;
    private String header;
    private String content;
    private String signature;
    private String timeOfCreation;
    private String timeOfDeletion;
    private int year;

    @OneToMany(mappedBy = "announcement")
    @JsonManagedReference
    private List<AnnouncementAttachment> announcementAttachment;


    public Announcement(Long id,String title, String header, String content, String signature, String timeOfCreation, String timeOfDeletion, int year) {
        this.title=title;
        this.id = id;
        this.header = header;
        this.content = content;
        this.signature = signature;
        this.timeOfCreation = timeOfCreation;
        this.timeOfDeletion = timeOfDeletion;
        this.year = year;
    }

    public Announcement() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getTimeOfCreation() {
        return timeOfCreation;
    }

    public void setTimeOfCreation(String timeOfCreation) {
        this.timeOfCreation = timeOfCreation;
    }

    public String getTimeOfDeletion() {
        return timeOfDeletion;
    }

    public void setTimeOfDeletion(String timeOfDeletion) {
        this.timeOfDeletion = timeOfDeletion;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public List<AnnouncementAttachment> getAnnouncementAttachment() {
        return announcementAttachment;
    }

    public void setAnnouncementAttachment(List<AnnouncementAttachment> announcementAttachment) {
        this.announcementAttachment = announcementAttachment;
    }

    @Override
    public String toString() {
        return "Announcement{" +
                "id=" + id +
                ", header='" + header + '\'' +
                ", content='" + content + '\'' +
                ", signature='" + signature + '\'' +
                ", timeOfCreation=" + timeOfCreation +
                ", timeOfDeletion=" + timeOfDeletion +
                ", year=" + year +
                ", attachmenst=" + announcementAttachment+
                '}';
    }
}
