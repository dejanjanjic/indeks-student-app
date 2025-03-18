package net.etfbl.indeks.dto;

public class MaterialResponseDTO {
    private String name; // The name of the file (including extension)
    private String base64Content; // Base64-encoded content of the file

    // Constructors, getters, and setters
    public MaterialResponseDTO(String name, String base64Content) {
        this.name = name;
        this.base64Content = base64Content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBase64Content() {
        return base64Content;
    }

    public void setBase64Content(String base64Content) {
        this.base64Content = base64Content;
    }
}
