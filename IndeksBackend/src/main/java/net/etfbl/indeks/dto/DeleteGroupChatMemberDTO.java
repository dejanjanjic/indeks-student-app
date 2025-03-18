package net.etfbl.indeks.dto;

public class DeleteGroupChatMemberDTO {
    private Long groupChatId;
    private Long accountId;

    public DeleteGroupChatMemberDTO() {
    }

    public DeleteGroupChatMemberDTO(Long groupChatId, Long accountId) {
        this.groupChatId = groupChatId;
        this.accountId = accountId;
    }

    public Long getGroupChatId() {
        return groupChatId;
    }

    public void setGroupChatId(Long elementaryGroupChatId) {
        this.groupChatId = elementaryGroupChatId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
}
