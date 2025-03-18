package net.etfbl.indeks.dto;

public class AddPrivateGroupChatMemberDTO {
    private Long privateGroupChatId;
    private Long studentAccountId;

    public AddPrivateGroupChatMemberDTO() {
    }

    public AddPrivateGroupChatMemberDTO(Long privateGroupChatId, Long studentAccountId) {
        this.privateGroupChatId = privateGroupChatId;
        this.studentAccountId = studentAccountId;
    }

    public Long gePrivateGroupChatId() {
        return privateGroupChatId;
    }

    public void setPrivateGroupChatId(Long privateGroupChatId) {
        this.privateGroupChatId = privateGroupChatId;
    }

    public Long getStudentAccountId() {
        return studentAccountId;
    }

    public void setStudentAccountId(Long studentAccountId) {
        this.studentAccountId = studentAccountId;
    }
}
