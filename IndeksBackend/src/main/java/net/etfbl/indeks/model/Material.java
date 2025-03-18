package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
@Table
public class Material {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    private String name;
    private String content;
    @ManyToOne
    @JoinColumn(name = "subjectId", referencedColumnName = "id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "ownerAccountId", referencedColumnName = "id")
    private UserAccount ownerAccount;

    public Material() {
    }

    public Material(String name, String content, Subject subject, UserAccount ownerAccount) {
        this.name = name;
        this.content = content;
        this.subject = subject;
        this.ownerAccount = ownerAccount;
    }

    public Material(Long id, String name, String content, Subject subject, UserAccount ownerAccount) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.subject = subject;
        this.ownerAccount = ownerAccount;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public UserAccount getOwnerAccount() {
        return ownerAccount;
    }

    public void setOwnerAccount(UserAccount ownerAccount) {
        this.ownerAccount = ownerAccount;
    }

    @Override
    public String toString() {
        return "Material{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", content='" + content + '\'' +
                ", subject=" + subject +
                ", ownerAccount=" + ownerAccount +
                '}';
    }
}
