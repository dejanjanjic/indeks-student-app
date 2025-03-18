package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
@Table
@IdClass(PrivateGroupChatMemberId.class) // Ovdje navodimo klasu koja predstavlja kombinirani primarni ključ
public class PrivateGroupChatMember
{
    @Id
    @ManyToOne
    @JoinColumn(name = "groupid")
    private PrivateGroupChat privateGroupChat;

    @Id
    @ManyToOne
    @JoinColumn(name = "accountid")
    private UserAccount userAccount;

    public PrivateGroupChatMember(){}

    public PrivateGroupChatMember(UserAccount userAccount, PrivateGroupChat privateGroupChat) {
        this.userAccount = userAccount;
        this.privateGroupChat = privateGroupChat;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public PrivateGroupChat getPrivateGroupChat() {
        return privateGroupChat;
    }

    public void setPrivateGroupChat(PrivateGroupChat privateGroupChat) {
        this.privateGroupChat = privateGroupChat;
    }
}
