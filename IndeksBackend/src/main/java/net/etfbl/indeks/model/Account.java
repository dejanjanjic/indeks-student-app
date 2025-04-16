package net.etfbl.indeks.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import net.etfbl.indeks.security.enumeration.Roles;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Setter
@Getter
@Entity
@Table
public class Account implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    private String recoveryToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role; // Dodato polje za ulogu

    public Account() {
    }

    public Account(String email, String password, Roles role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Account(Long id, String email, String password, Roles role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role + // Dodato ispisivanje uloge
                '}';
    }
}
