package net.etfbl.indeks.service;

import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import net.etfbl.indeks.dto.AddUserAccountDTO;
import net.etfbl.indeks.dto.UserAccountDTO;
import net.etfbl.indeks.dto.UserAccountDetailsDTO;
import net.etfbl.indeks.dto.UserAccountSummaryDTO;
import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.security.blacklisting.service.BlacklistedTokenService;
import net.etfbl.indeks.security.enumeration.Roles;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.AccountRepository;
import net.etfbl.indeks.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private final AccountRepository accountRepository;
    private final EmailService emailService;

    private final JavaMailSender mailSender;

    private final BlacklistedTokenService blacklistedTokenService;
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public UserAccountService(UserAccountRepository userAccountRepository, AccountRepository accountRepository, EmailService emailService, JavaMailSender mailSender, BlacklistedTokenService blacklistedTokenService) {
        this.userAccountRepository = userAccountRepository;
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.mailSender = mailSender;
        this.blacklistedTokenService = blacklistedTokenService;
    }

    public List<UserAccountDTO> getUserAccounts() {
        return userAccountRepository.findAll().stream()
                .map(user -> new UserAccountDTO(user.getId(), user.getFirstName(), user.getLastName()))
                .collect(Collectors.toList());
    }
    public List<UserAccountDetailsDTO> searchUserAccountDetailsByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return userAccountRepository.findAllUserAccountDetails();
        }
        return userAccountRepository.searchUserAccountDetailsByKeyword(keyword.trim());
    }
    public Optional<UserAccount> getUserAccountById(Long id) {
        return userAccountRepository.findById(id);
    }

    public Optional<UserAccount> getUserAccountByEmail(String email) {
        return userAccountRepository.findByEmail(email);
    }

    @Transactional
    public UserAccount addNewUserAccount(AddUserAccountDTO addUserAccountDTO, Roles role) {
        Optional<Account> accountByEmail = accountRepository.findByEmail(addUserAccountDTO.getEmail());
        if (accountByEmail.isEmpty()) {
            Account account = new Account(addUserAccountDTO.getEmail(), addUserAccountDTO.getPassword(), role);
            Account savedAccount = accountRepository.save(account);
            UserAccount userAccount = new UserAccount(addUserAccountDTO.getFirstName(), addUserAccountDTO.getLastName(), true, false, savedAccount);

            return userAccountRepository.save(userAccount);
        }
        return null;
    }

    public boolean deleteUserAccount(Long id) {
        Optional<UserAccount> userAccount = userAccountRepository.findById(id);
        if (userAccount.isEmpty()) {
            return false;
        }
        userAccountRepository.deleteById(id);
        return true;
    }

    @Transactional
    public boolean updateUserAccount(UserAccount userAccount) {
        Optional<UserAccount> temp = userAccountRepository.findById(userAccount.getId());
        if (temp.isEmpty()) {
            return false;
        }
        UserAccount updatedUserAccount = temp.get();
        if (userAccount.getFirstName() != null) {
            updatedUserAccount.setFirstName(userAccount.getFirstName());
        }
        if (userAccount.getLastName() != null) {
            updatedUserAccount.setLastName(userAccount.getLastName());
        }
        if (userAccount.getActive() != null) {
            updatedUserAccount.setActive(userAccount.getActive());
        }
        if (userAccount.getSuspended() != null) {
            updatedUserAccount.setSuspended(userAccount.getSuspended());
        }

        userAccountRepository.save(updatedUserAccount);
        return true;
    }

//    public boolean sendPasswordRecoveryEmail(String email) {
//        Optional<Account> accountOpt = accountRepository.findByEmail(email);
//        if (accountOpt.isPresent())
//        {
//
//            Account account = accountOpt.get();
//
//            String newPassword =  UUID.randomUUID().toString().substring(0,8);
//
//            String encryptedPassword = encryption.encryptPassword(newPassword);
//            account.setPassword(encryptedPassword);
//
//            accountRepository.save(account);
//
//            emailService.sendEmail(email, "Oporavka lozinke",
//                    "Vaša nova lozinka je: " + newPassword+", možete ju promjeniti u aplikaciji.");
//
//            return true;
//        }
//        return false;
//    }

    public List<UserAccountSummaryDTO> getUserAccountSummaries() {
        // Fetch user accounts and join with account table to get email
        List<Object[]> results = entityManager.createQuery(
                "SELECT ua.id, ua.firstName, ua.lastName, ua.active, a.email " +
                        "FROM UserAccount ua " +
                        "JOIN Account a ON ua.id = a.id", Object[].class
        ).getResultList();

        List<UserAccountSummaryDTO> summaries = new ArrayList<>();

        for (Object[] result : results) {
            UserAccountSummaryDTO summary = new UserAccountSummaryDTO(
                    ((Number) result[0]).longValue(), // ID
                    (String) result[1],              // First Name
                    (String) result[2],              // Last Name
                    (Boolean) result[3],             // Active
                    (String) result[4]               // Email
            );
            summaries.add(summary);
        }

        return summaries;
    }


//    @Transactional
//    public boolean updatePassword(String email, String newPassword) {
//        Optional<Account> accountOpt = accountRepository.findByEmail(email);
//        if (accountOpt.isPresent()) {
//            Account account = accountOpt.get();
//
//
//            String encryptedPassword = encryption.encryptPassword(newPassword);
//            account.setPassword(encryptedPassword);
//
//
//            account.setRecoveryToken(null);
//
//            accountRepository.save(account);
//            return true;
//        }
//        return false;
//    }

    public void updatePushNotificationToken(Long id, String token) {
        UserAccount userAccount = userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserAccount not found with id: " + id));
        userAccount.setPushNotificationToken(token);
        userAccountRepository.save(userAccount);
    }

    public UserAccount suspendAccount(Long id) {
        UserAccount userAccount = userAccountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("UserAccount with id " + id + " not found"));

        Account account = accountRepository.findById(userAccount.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account associated with UserAccount not found"));

        String email = account.getEmail();

        boolean wasActive = Boolean.TRUE.equals(userAccount.getActive());
        userAccount.setActive(!wasActive);

        // Save the updated account
        UserAccount updatedAccount = userAccountRepository.save(userAccount);

        // Prepare email content
        String emailSubject = wasActive ? "Obavještenje o suspenziji naloga" : "Obavještenje o aktivaciji naloga";
        String emailContent = wasActive
                ? "<p>Dragi korisniče,</p>" +
                "<p>Vaš nalog je suspendovan, više se nećete moći prijaviti do daljnjeg.<p>"+
                "<p>Ako imate bilo kakva pitanja, molimo kontaktirajte našu podršku.</p>" +
                "<p>Srdačno,<br>Vaš INDEKS tim</p>"
                : "<p>Dragi korisniče,</p>" +
                "<p>Vaš nalog je ponovo aktiviran, te se možete prijaviti!</p>" +
                "<p>Srdačno,<br>Vaš INDEKS tim</p>";

        try {
            // Create and send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("indeks.aplikacija@gmail.com");
            helper.setTo(email);
            helper.setSubject(emailSubject);
            helper.setText(emailContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email notification: " + e.getMessage(), e);
        }

        return updatedAccount;
    }


    public boolean checkActiveStatus(String email) {
        Optional<UserAccount> userAccount = userAccountRepository.findByEmail(email);
        Optional<Account> account = accountRepository.findByEmail(email);
        if (userAccount.isPresent()) {
            return userAccount.get().getActive();
        } else return account.isPresent();
    }

    public List<UserAccountDetailsDTO> getUserAccountDetails() {
        return userAccountRepository.findAllUserAccountDetails();
    }

//    public UserAccount unsuspendAccount(Long id) {
//        UserAccount userAccount = userAccountRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("UserAccount with id " + id + " not found"));
//        if (Boolean.FALSE.equals(userAccount.getActive())) {
//            throw new IllegalStateException("Account is not suspended");
//        }
//        userAccount.setActive(false);
//        return userAccountRepository.save(userAccount);
//    }
}
