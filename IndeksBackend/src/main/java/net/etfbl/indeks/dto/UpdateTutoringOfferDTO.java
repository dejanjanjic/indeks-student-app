package net.etfbl.indeks.dto;

public class UpdateTutoringOfferDTO {

    private Long id;
    private String description;

    public UpdateTutoringOfferDTO(Long id, String description)
    {
        this.id = id;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "UpdateTutoringOfferDTO{" +
                "id=" + id +
                ", description='" + description +
                '}';
    }

}