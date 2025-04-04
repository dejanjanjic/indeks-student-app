package net.etfbl.indeks.dto;

public class UpdateSubjectDTO {
    private Long id;
    private String name;
    private int year;

    // Add constructors, getters, and setters
    public UpdateSubjectDTO() {
    }

    public UpdateSubjectDTO(Long id, String name, int year) {
        this.id = id;
        this.name = name;
        this.year = year;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
}