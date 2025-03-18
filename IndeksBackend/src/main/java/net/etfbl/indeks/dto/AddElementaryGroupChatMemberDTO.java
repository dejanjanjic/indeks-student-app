package net.etfbl.indeks.dto;

public class AddElementaryGroupChatMemberDTO {
    private Long elementaryGroupChatId;
    private Long studentAccountId;

    public AddElementaryGroupChatMemberDTO() {
    }

    public AddElementaryGroupChatMemberDTO(Long elementaryGroupChatId, Long studentAccountId) {
        this.elementaryGroupChatId = elementaryGroupChatId;
        this.studentAccountId = studentAccountId;
    }

    public Long getElementaryGroupChatId() {
        return elementaryGroupChatId;
    }

    public void setElementaryGroupChatId(Long elementaryGroupChatId) {
        this.elementaryGroupChatId = elementaryGroupChatId;
    }

    public Long getStudentAccountId() {
        return studentAccountId;
    }

    public void setStudentAccountId(Long studentAccountId) {
        this.studentAccountId = studentAccountId;
    }
}
