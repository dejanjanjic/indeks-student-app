package net.etfbl.indeks.dto;

import net.etfbl.indeks.model.MessageStatus;

import java.time.LocalDateTime;

public class GroupMessageDTO {
    private Long messageId;
    private String text;
    private LocalDateTime time;
    private String senderFullName;  // Changed from senderUsername to senderFullName
    private String groupChatName;
    private MessageStatus status;

    public GroupMessageDTO(Long messageId, String text, LocalDateTime time, String senderFullName, String groupChatName, MessageStatus status) {
        this.messageId = messageId;
        this.text = text;
        this.time = time;
        this.senderFullName = senderFullName;
        this.groupChatName = groupChatName;
        this.status = status;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
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

    public String getSenderFullName() {  // Updated getter
        return senderFullName;
    }

    public void setSenderFullName(String senderFullName) {  // Updated setter
        this.senderFullName = senderFullName;
    }

    public String getGroupChatName() {
        return groupChatName;
    }

    public void setGroupChatName(String groupChatName) {
        this.groupChatName = groupChatName;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }
}

