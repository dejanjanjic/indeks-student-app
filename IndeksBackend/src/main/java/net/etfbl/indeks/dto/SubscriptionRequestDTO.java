package net.etfbl.indeks.dto;

public  class SubscriptionRequestDTO {
    private Integer tutoringOfferId;
    private Integer studentAccountId;

    public SubscriptionRequestDTO() {
    }

    public Integer getTutoringOfferId() {
        return tutoringOfferId;
    }

    public void setTutoringOfferId(Integer tutoringOfferId) {
        this.tutoringOfferId = tutoringOfferId;
    }

    public Integer getStudentAccountId() {
        return studentAccountId;
    }

    public void setStudentAccountId(Integer studentAccountId) {
        this.studentAccountId = studentAccountId;
    }
}
