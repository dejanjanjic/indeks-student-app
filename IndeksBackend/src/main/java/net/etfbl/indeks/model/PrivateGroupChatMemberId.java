package net.etfbl.indeks.model;

import java.io.Serializable;
import java.util.Objects;

public class PrivateGroupChatMemberId implements Serializable {

    private Long privateGroupChat;
    private Long userAccount;

    public PrivateGroupChatMemberId() {}

    public PrivateGroupChatMemberId(Long privateGroupChat, Long userAccount) {
        this.privateGroupChat = privateGroupChat;
        this.userAccount = userAccount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PrivateGroupChatMemberId that = (PrivateGroupChatMemberId) o;
        return Objects.equals(privateGroupChat, that.privateGroupChat) &&
                Objects.equals(userAccount, that.userAccount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(privateGroupChat, userAccount);
    }
}