package net.etfbl.indeks.dto;

public class MaterialSummaryDTO {
    private Long id; // The ID of the material
    private String name; // The name of the material

    // Constructor
    public MaterialSummaryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and setters
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
}
