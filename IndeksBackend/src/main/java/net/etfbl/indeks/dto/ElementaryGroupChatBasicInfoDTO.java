package net.etfbl.indeks.dto;

import net.etfbl.indeks.model.ElementaryGroupChat;

public class ElementaryGroupChatBasicInfoDTO {
    private Long id;
    private String name;
    private Integer size;

    public ElementaryGroupChatBasicInfoDTO() {
    }

    public ElementaryGroupChatBasicInfoDTO(ElementaryGroupChat elementaryGroupChat){
        this.id = elementaryGroupChat.getId();
        this.name = elementaryGroupChat.getGroupChat().getName();
        this.size = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
