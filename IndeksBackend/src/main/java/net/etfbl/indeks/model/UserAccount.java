package net.etfbl.indeks.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table
public class UserAccount {
    @Id
    private Long id;

    private String firstName;
    private String lastName;
    private Boolean active;
    private Boolean suspended;

    private transient String recoveryToken;
    private String pushNotificationToken;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "id")
    @MapsId
    private Account account;

    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlockedAccount> blockedAccounts;

    @OneToMany(mappedBy = "blockedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlockedAccount> blockedBy;

    public UserAccount() {
    }

    public UserAccount(String firstName, String lastName, Boolean active, Boolean suspended) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
        this.suspended = suspended;
    }

    public UserAccount(String firstName, String lastName, Boolean active, Boolean suspended, Account account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
        this.suspended = suspended;
        this.account = account;
    }

    @Override
    public String toString() {
        return "UserAccount{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", active=" + active +
                ", suspended=" + suspended +
                ", account=" + account +
                '}';
    }
}
