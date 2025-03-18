package net.etfbl.indeks.model;


import jakarta.persistence.*;

@Entity
@Table
public class ElementaryGroupChat {

    @Id
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE)
    @MapsId
    @JoinColumn(name = "id")
    private GroupChat groupChat;

    public ElementaryGroupChat() {
    }

    public ElementaryGroupChat(GroupChat groupChat) {
        this.groupChat = groupChat;
    }

    public GroupChat getGroupChat() {
        return groupChat;
    }

    public void setGroupChat(GroupChat groupChat) {
        this.groupChat = groupChat;
        this.id = groupChat.getId();
    }

    public Long getId() {
        return id;
    }
}

