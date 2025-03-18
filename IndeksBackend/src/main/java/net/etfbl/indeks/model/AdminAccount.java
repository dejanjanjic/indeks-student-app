package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
@Table
public class AdminAccount {

    @Id
    private Long id;

    @OneToOne
    @JoinColumn(name = "id")
    @MapsId
    private Account account;

    public AdminAccount(){
    }

    public AdminAccount(Account account){
        this.account = account;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
