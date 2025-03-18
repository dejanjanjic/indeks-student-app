package net.etfbl.indeks.dto;

import java.time.LocalDateTime;

public class BlockedUserDTO {
    private Long id;  // Add this field
    private String firstName;
    private String lastName;
    private LocalDateTime dateBlocked;

    public BlockedUserDTO(Long id, String firstName, String lastName, LocalDateTime dateBlocked) {
        this.id = id;  // Initialize id
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateBlocked = dateBlocked;
    }

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

    public LocalDateTime getDateBlocked() {
        return dateBlocked;
    }

    public void setDateBlocked(LocalDateTime dateBlocked) {
        this.dateBlocked = dateBlocked;
    }

    @Override
    public String toString() {
        return "BlockedUserDTO{" +
                "id=" + id +  // Include id in the toString output
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateBlocked=" + dateBlocked +
                '}';
    }
}
