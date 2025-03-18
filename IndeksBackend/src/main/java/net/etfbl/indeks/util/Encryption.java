package net.etfbl.indeks.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Encryption
{
    public Encryption(){}
    public String encryptPassword(String password) {
        try {

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            BCryptPasswordEncoder BPE = new BCryptPasswordEncoder();


            byte[] hash = digest.digest(password.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }


            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
