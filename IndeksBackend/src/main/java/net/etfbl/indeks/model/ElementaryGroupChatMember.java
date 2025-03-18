package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
@Table
@IdClass(ElementaryGroupChatMemberId.class)
public class ElementaryGroupChatMember {

    @ManyToOne
    @JoinColumn(name = "groupId")
    @Id
    private ElementaryGroupChat elementaryGroupChat;

    @ManyToOne
    @JoinColumn(name = "accountId")
    @Id
    private StudentAccount studentAccount;

    public ElementaryGroupChatMember() {
    }

    public ElementaryGroupChatMember(ElementaryGroupChat elementaryGroupChat, StudentAccount studentAccount) {
        this.elementaryGroupChat = elementaryGroupChat;
        this.studentAccount = studentAccount;
    }

    public ElementaryGroupChat getElementaryGroupChat() {
        return elementaryGroupChat;
    }

    public void setElementaryGroupChat(ElementaryGroupChat elementaryGroupChat) {
        this.elementaryGroupChat = elementaryGroupChat;
    }

    public StudentAccount getStudentAccount() {
        return studentAccount;
    }

    public void setStudentAccount(StudentAccount studentAccount) {
        this.studentAccount = studentAccount;
    }
}