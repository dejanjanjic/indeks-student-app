package net.etfbl.indeks.dto;

import java.time.LocalDateTime;

public class GetMessageDTO {

    private String id;
    private String text;
    private LocalDateTime time;
    private boolean isSentByUser;

    // Constructors, getters, and setters

    public GetMessageDTO(String id, String text, LocalDateTime time, boolean isSentByUser)
    {
        this.id = id;
        this.text = text;
        this.time = time;
        this.isSentByUser = isSentByUser;
    }

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

    public  LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public boolean isSentByUser() {
        return isSentByUser;
    }

    public void setSentByUser(boolean isSentByUser) {
        this.isSentByUser = isSentByUser;
    }
}
