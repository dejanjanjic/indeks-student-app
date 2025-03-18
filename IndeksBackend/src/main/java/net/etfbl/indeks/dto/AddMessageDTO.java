package net.etfbl.indeks.dto;

import net.etfbl.indeks.model.MessageStatus;

import java.time.LocalDateTime;

public class AddMessageDTO {
    private String text;
    private LocalDateTime time;
    private Long singleChatId;
    private Long groupChatId;
    private MessageStatus status;
    private String userAccountId;

    public AddMessageDTO () {

    }

    public AddMessageDTO(String text, LocalDateTime time, Long singleChatId,
                         Long groupChatId, MessageStatus status, String userAccountId) {
        this.text = text;
        this.time = time;
        this.singleChatId = singleChatId;
        this.groupChatId = groupChatId;
        this.status = status;
        this.userAccountId = userAccountId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Long getSingleChatId() {
        return singleChatId;
    }

    public void setSingleChatId(Long singleChatId) {
        this.singleChatId = singleChatId;
    }

    public Long getGroupChatId() {
        return groupChatId;
    }

    public void setGroupChatId(Long groupChatId) {
        this.groupChatId = groupChatId;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }

    public String getUserAccountId() {
        return userAccountId;
    }

    public void setUserAccountId(String userAccountId) {
        this.userAccountId = userAccountId;
    }
}
