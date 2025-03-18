package net.etfbl.indeks.dto;

public class AddElementaryGroupChatDTO {

    private String name;

    public AddElementaryGroupChatDTO() { }

    public AddElementaryGroupChatDTO(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
