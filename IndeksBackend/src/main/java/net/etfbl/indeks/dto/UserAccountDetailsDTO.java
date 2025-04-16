package net.etfbl.indeks.dto;

import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.security.enumeration.Roles;

public class UserAccountDetailsDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private Boolean active;
    private String email;
    private Roles role;

    public UserAccountDetailsDTO() {
    }

    public UserAccountDetailsDTO(Long id, String firstName, String lastName, Boolean active, String email, Roles role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
        this.email = email;
        this.role = role;
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

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }
}
