package net.etfbl.indeks.dto;

public class AddTutoringOfferDTO {

    private String description;
    private Long subjectId;
    private Long tutorAccountId;

    public AddTutoringOfferDTO() {}

    public AddTutoringOfferDTO(String description, Long subjectId, Long tutorAccountId) {
        this.description = description;
        this.subjectId = subjectId;
        this.tutorAccountId = tutorAccountId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getTutorAccountId() {
        return tutorAccountId;
    }

    public void setTutorAccountId(Long tutorAccountId) {
        this.tutorAccountId = tutorAccountId;
    }


    @Override
    public String toString() {
        return "TutoringOfferDTO{" +
                ", description='" + description + '\'' +
                ", subjectId=" + subjectId +
                ", tutorAccountId=" + tutorAccountId +
                '}';
    }
}
