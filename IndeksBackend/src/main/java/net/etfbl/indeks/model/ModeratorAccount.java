package net.etfbl.indeks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModeratorAccount {
    @Id
    private Long id;
    private String firstName;
    private String lastName;
    private Long materialPath;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "id")
    @MapsId
    private Account account;
}