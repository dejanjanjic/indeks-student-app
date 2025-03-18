package net.etfbl.indeks.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BlockedAccount")
public class BlockedAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userAccountId", nullable = false)
    private UserAccount userAccount;

    @ManyToOne
    @JoinColumn(name = "blockedUserId", nullable = false)
    private UserAccount blockedUser;

    private LocalDateTime dateBlocked;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public UserAccount getBlockedUser() {
        return blockedUser;
    }

    public void setBlockedUser(UserAccount blockedUser) {
        this.blockedUser = blockedUser;
    }

    public LocalDateTime getDateBlocked() {
        return dateBlocked;
    }

    public void setDateBlocked(LocalDateTime dateBlocked) {
        this.dateBlocked = dateBlocked;
    }
}
