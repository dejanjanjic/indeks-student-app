package net.etfbl.indeks.security.enumeration;

public enum RegistrationStatus {
    ACCOUNT_ALREADY_EXISTS, // Ako nalog već postoji
    INVALID_FLAG,           // Ako je flag neispravan
    SUCCESS,                // Ako je dodavanje uspješno
    INVALID_STUDENT_EMAIL;  // Ako je domen studentskog naloga pogrešan
}
