package net.etfbl.indeks.dto;

public class UserAccountSummaryDTO {
    private Long id;  // ID field
    private String firstName;
    private String lastName;
    private Boolean active;
    private String email;  // Add email field

    // Constructors
    public UserAccountSummaryDTO() {
    }

    public UserAccountSummaryDTO(Long id, String firstName, String lastName, Boolean active, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
