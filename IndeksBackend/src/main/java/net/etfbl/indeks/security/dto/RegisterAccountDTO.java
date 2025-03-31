package net.etfbl.indeks.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterAccountDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String type;
}
