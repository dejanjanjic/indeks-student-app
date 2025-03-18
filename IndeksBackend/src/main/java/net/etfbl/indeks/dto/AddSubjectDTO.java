package net.etfbl.indeks.dto;

public class AddSubjectDTO {
    private String name;
    private int year;

    public AddSubjectDTO() {}

    public AddSubjectDTO(String name, int year) {
        this.name = name;
        this.year = year;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
