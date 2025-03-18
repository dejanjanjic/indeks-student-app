package net.etfbl.indeks.dto;

import java.util.List;

public class AddPrivateGroupChatDTO {

    private String name;
    private List<Long> memberIds;

    public AddPrivateGroupChatDTO() {}

    public AddPrivateGroupChatDTO(String name, List<Long> memberIds) {
        this.name = name;
        this.memberIds = memberIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<Long> memberIds) {
        this.memberIds = memberIds;
    }
}