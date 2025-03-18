package net.etfbl.indeks.model;


import jakarta.persistence.*;

@Entity
@Table
public class PotentialPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;

    private String tempPassword;

    public PotentialPassword() {
    }

    public PotentialPassword(Long accountId, String tempPassword) {
        this.accountId = accountId;
        this.tempPassword = tempPassword;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }
}
