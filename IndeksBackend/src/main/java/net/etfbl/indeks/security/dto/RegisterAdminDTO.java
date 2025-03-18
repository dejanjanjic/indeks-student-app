package net.etfbl.indeks.security.dto;

public class RegisterAdminDTO {
    private String email;
    private String password;

    public RegisterAdminDTO() {
    }

    public RegisterAdminDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
