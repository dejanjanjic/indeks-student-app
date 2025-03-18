package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
@Table
public class SingleChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name ="firstParticipantId", referencedColumnName = "id")
    private UserAccount firstParticipant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "secondParticipantId", referencedColumnName = "id")
    private UserAccount secondParticipant;

    public SingleChat() {

    }

    public SingleChat(UserAccount firstParticipant, UserAccount secondParticipant) {
        this.firstParticipant = firstParticipant;
        this.secondParticipant = secondParticipant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserAccount getFirstParticipant() {
        return firstParticipant;
    }

    public void setFirstParticipant(UserAccount firstParticipant) {
        this.firstParticipant = firstParticipant;
    }

    public UserAccount getSecondParticipant() {
        return secondParticipant;
    }

    public void setSecondParticipant(UserAccount secondParticipant) {
        this.secondParticipant = secondParticipant;
    }

    public UserAccount getOtherUser(UserAccount user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (user.equals(firstParticipant)) {
            return secondParticipant;
        } else if (user.equals(secondParticipant)) {
            return firstParticipant;
        } else {
            throw new IllegalArgumentException("User is not part of this chat");
        }
    }

}
