package net.etfbl.indeks.dto;

import java.time.LocalDateTime;

public class MessageWithSenderDTO {

    private String id;
    private String text;
    private LocalDateTime time;
    private boolean isSentByUser;
    private String senderFullName; // New field for the sender's full name

    // Constructor
    public MessageWithSenderDTO(String messageId, String messageText, LocalDateTime messageTime, boolean sentByUser, String senderFullName) {
        this.id = messageId;
        this.text = messageText;
        this.time = messageTime;
        this.isSentByUser = sentByUser;
        this.senderFullName = senderFullName;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public boolean isSentByUser() {
        return isSentByUser;
    }

    public void setSentByUser(boolean sentByUser) {
        this.isSentByUser = sentByUser;
    }

    public String getSenderFullName() {
        return senderFullName;
    }

    public void setSenderFullName(String senderFullName) {
        this.senderFullName = senderFullName;
    }
}

