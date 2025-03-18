package net.etfbl.indeks.model;

import java.io.Serializable;
import java.util.Objects;

public class ElementaryGroupChatMemberId implements Serializable {

    private Long elementaryGroupChat;
    private Long studentAccount;

    public ElementaryGroupChatMemberId() {}

    public ElementaryGroupChatMemberId(Long elementaryGroupChat, Long studentAccount) {
        this.elementaryGroupChat = elementaryGroupChat;
        this.studentAccount = studentAccount;
    }

    public Long getElementaryGroupChat() {
        return elementaryGroupChat;
    }

    public void setElementaryGroupChat(Long elementaryGroupChat) {
        this.elementaryGroupChat = elementaryGroupChat;
    }

    public Long getStudentAccount() {
        return studentAccount;
    }

    public void setStudentAccount(Long studentAccount) {
        this.studentAccount = studentAccount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ElementaryGroupChatMemberId that = (ElementaryGroupChatMemberId) o;
        return Objects.equals(elementaryGroupChat, that.elementaryGroupChat) &&
                Objects.equals(studentAccount, that.studentAccount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(elementaryGroupChat, studentAccount);
    }
}