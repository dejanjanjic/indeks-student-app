package net.etfbl.indeks.dto;

public class LastMessageInfo {

    private String message;
    private String sender;
    private String messageTime;

    public LastMessageInfo(String message, String sender, String messageTime) {
        this.message = message;
        this.sender = sender;
        this.messageTime = messageTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessageTime() {
        return messageTime;
    }

    public void setMessageTime(String messageTime) {
        this.messageTime = messageTime;
    }
}
