package net.etfbl.indeks.dto;

public class AddSingleChatDTO {
    private Long firstParticipantId;
    private Long secondParticipantId;

    public AddSingleChatDTO() {

    }

    public AddSingleChatDTO(Long firstParticipantId, Long secondParticipantId) {
        this.firstParticipantId = firstParticipantId;
        this.secondParticipantId = secondParticipantId;
    }

    public Long getFirstParticipantId() {
        return firstParticipantId;
    }

    public void setFirstParticipantId(Long firstParticipantId) {
        this.firstParticipantId = firstParticipantId;
    }

    public Long getSecondParticipantId() {
        return secondParticipantId;
    }

    public void setSecondParticipantId(Long secondParticipantId) {
        this.secondParticipantId = secondParticipantId;
    }
}
