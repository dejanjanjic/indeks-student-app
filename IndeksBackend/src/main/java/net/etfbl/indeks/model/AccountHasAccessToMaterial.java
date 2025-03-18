package net.etfbl.indeks.model;

import jakarta.persistence.*;

@Entity
public class AccountHasAccessToMaterial {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    @ManyToOne
    @JoinColumn(name = "accountId", referencedColumnName = "id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "materialId", referencedColumnName = "id")
    private Material material;

    public AccountHasAccessToMaterial() {
    }

    public AccountHasAccessToMaterial(Account account, Material material) {
        this.account = account;
        this.material = material;
    }

    public AccountHasAccessToMaterial(Long id, Account account, Material material) {
        this.id = id;
        this.account = account;
        this.material = material;
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

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    @Override
    public String toString() {
        return "AccountHasAccessToMaterial{" +
                "id=" + id +
                ", account=" + account +
                ", material=" + material +
                '}';
    }
}
