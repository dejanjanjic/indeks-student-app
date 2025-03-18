package net.etfbl.indeks.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;


@Entity
@Table
public class AnnouncementAttachment {

    @Id
    private int id;
    private String name;
    private String pathName;
    private String extension;

    @ManyToOne
    @JoinColumn(name = "announcementId")
    @JsonBackReference
    private Announcement announcement;

    public AnnouncementAttachment(int id, String name, String pathName, String extension, Announcement announcement) {
        this.id = id;
        this.name = name;
        this.pathName = pathName;
        this.extension = extension;
        this.announcement = announcement;
    }


    public AnnouncementAttachment() {
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathName() {
        return pathName;
    }

    public void setPathName(String pathName) {
        this.pathName = pathName;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public Announcement getAnnouncement() {
        return announcement;
    }

    public void setAnnouncement(Announcement announcement) {
        this.announcement = announcement;
    }

    @Override
    public String toString() {
        return "AnnouncementAttachment{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pathName='" + pathName + '\'' +
                ", extension='" + extension + '\'' +
                ", announcement=" + announcement.getId() +
                '}';
    }
}
