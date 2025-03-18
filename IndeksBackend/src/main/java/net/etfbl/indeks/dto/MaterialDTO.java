package net.etfbl.indeks.dto;

public class MaterialDTO {
    private String base64; // The Base64-encoded file content
    private String name; // The name of the file (including extension)
    private Long subjectId; // The subject's ID
    private Long ownerAccountId; // The owner's account ID

    // Getters and setters
    public String getBase64() {
        return base64;
    }

    public void setBase64(String base64) {
        this.base64 = base64;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getOwnerAccountId() {
        return ownerAccountId;
    }

    public void setOwnerAccountId(Long ownerAccountId) {
        this.ownerAccountId = ownerAccountId;
    }
}
