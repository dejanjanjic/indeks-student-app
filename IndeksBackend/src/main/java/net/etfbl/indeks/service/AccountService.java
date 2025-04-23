package net.etfbl.indeks.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import net.etfbl.indeks.dto.UpdateAccountDTO;
import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.PotentialPassword;
import net.etfbl.indeks.repository.AccountRepository;
import net.etfbl.indeks.repository.PotentialPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PotentialPasswordRepository potentialPasswordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Autowired
    public AccountService(AccountRepository accountRepository,
                          PotentialPasswordRepository potentialPasswordRepository,
                          PasswordEncoder passwordEncoder,
                          JavaMailSender mailSender) {
        this.accountRepository = accountRepository;
        this.potentialPasswordRepository = potentialPasswordRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public Optional<Long> getAccountIdByEmail(String email) {
        return accountRepository.findByEmail(email).map(Account::getId);
    }

    public String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder tempPassword = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            tempPassword.append(chars.charAt(random.nextInt(chars.length())));
        }
        return tempPassword.toString();
    }

    @Transactional
    public boolean sendRecoveryEmail(String email) {
        Optional<Account> accountOpt = accountRepository.findByEmail(email);
        if (accountOpt.isEmpty()) {
            return false;
        }

        Account account = accountOpt.get();
        String tempPassword = generateTemporaryPassword();
        PotentialPassword potentialPassword = new PotentialPassword(account.getId(), passwordEncoder.encode(tempPassword));
        savePotentialPassword(potentialPassword); // Ensures only one entry per user

        // Send the email
        try {
            sendEmail(email, tempPassword);
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }


    @Transactional
    public void savePotentialPassword(PotentialPassword potentialPassword) {
        // Check if a record for this accountId already exists
        Optional<PotentialPassword> existingPotentialPassword =
                potentialPasswordRepository.findByAccountId(potentialPassword.getAccountId());

        if (existingPotentialPassword.isPresent()) {
            // Update the existing record
            PotentialPassword existing = existingPotentialPassword.get();
            existing.setTempPassword(potentialPassword.getTempPassword());
            potentialPasswordRepository.save(existing);
        } else {
            // Save as a new record
            potentialPasswordRepository.save(potentialPassword);
        }
    }



    private void sendEmail(String toEmail, String tempPassword) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("indeks.aplikacija@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Password Recovery");
        helper.setText(
                "<p>Dragi korisniče,</p>" +
                        "<p>Vaša nova lozinka je: <b>" + tempPassword + "</b></p>" +
                        "<p>Iskoristite ju da se prijavite, te ju možete naknadno promijeniti u aplikaciji</p>" +
                        "<p>Srdačno,<br>Vaš INDEKS tim</p>", true);

        mailSender.send(message);
    }

    @Transactional
    public boolean updatePassword(String email, String tempPassword, String newPassword) {
        Optional<Account> accountOpt = accountRepository.findByEmail(email);
        if (accountOpt.isEmpty()) {
            return false;
        }

        Account account = accountOpt.get();
        Optional<PotentialPassword> potentialPasswordOpt = potentialPasswordRepository.findByAccountId(account.getId());
        if (potentialPasswordOpt.isEmpty()) {
            return false;
        }

        PotentialPassword potentialPassword = potentialPasswordOpt.get();
        if (!passwordEncoder.matches(tempPassword, potentialPassword.getTempPassword())) {
            return false;
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        potentialPasswordRepository.delete(potentialPassword);

        return true;
    }

    public List<Account> getAccounts() {
        return accountRepository.findAll();
    }
    public Optional<Account> getAccountById(Long accountId) {
        return accountRepository.findById(accountId);
    }


    public Optional<Account> getAccountByEMail(String eMail) {
        return accountRepository.findByEmail(eMail);
    }

    public Optional<String> getAccountRoleByEMail(String eMail) {
            Optional<Account> account = accountRepository.findByEmail(eMail);
            return account.flatMap(value -> value.getRole().toString().describeConstable());
    }

    public Account addNewAccount(Account account) {
        Optional<Account> accountByEmail = accountRepository.findByEmail(account.getEmail());
        if(accountByEmail.isEmpty()){
            return accountRepository.save(account);
        }
        return null;
    }

    public boolean deleteAccount(Long accountId) {
        boolean exists = accountRepository.existsById(accountId);
        if(!exists){
            return false;
        }
        accountRepository.deleteById(accountId);
        return true;
    }


    @Transactional
    public boolean updateAccount(Account account) {
        Optional<Account> temp = accountRepository.findById(account.getId());
        if(temp.isEmpty()){
            return false;
        }
        Account updatedAccount = temp.get();
        if(account.getEmail() != null){
            updatedAccount.setEmail(account.getEmail());
        }
        if(account.getPassword() != null){
            updatedAccount.setPassword(account.getPassword());
        }
        accountRepository.save(updatedAccount);
        return true;
    }

    @Transactional
    public void changePassword(UpdateAccountDTO updateAccountDTO) {

        Long userId = updateAccountDTO.getUserId();
        String oldPassword = updateAccountDTO.getOldPassword();
        String newPassword = updateAccountDTO.getNewPassword();

        if (userId == null || oldPassword == null || newPassword == null ||
                oldPassword.isEmpty() || newPassword.isEmpty()) {
            throw new IllegalArgumentException("All fields must be filled!");
        }

        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password!");
        }

        if (passwordEncoder.matches(newPassword, account.getPassword())) {
            throw new IllegalArgumentException("New password must be different!");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
    }

}
