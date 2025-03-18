package net.etfbl.indeks.dto;

public class UpdateMessageDTO {

    private String text;

    public UpdateMessageDTO() {

    }

    public UpdateMessageDTO(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
