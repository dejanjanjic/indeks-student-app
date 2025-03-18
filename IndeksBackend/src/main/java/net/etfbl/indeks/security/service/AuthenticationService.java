package net.etfbl.indeks.security.service;

import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.*;
import net.etfbl.indeks.security.dto.LoginAccountDTO;
import net.etfbl.indeks.security.dto.RegisterAccountDTO;
import net.etfbl.indeks.security.enumeration.RegistrationStatus;
import net.etfbl.indeks.security.enumeration.Roles;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final AccountRepository accountRepository;
    private final StudentAccountRepository studentAccountRepository;
    private final TutorAccountRepository tutorAccountRepository;
    private final AdminAccountRepository adminAccountRepository;
    private final ScheduleRepository scheduleRepository;
    private final StudentAnnouncementVisibilityRepository studentAnnouncementVisibilityRepository;

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(
            AccountRepository accountRepository,
            StudentAccountRepository studentAccountRepository,
            TutorAccountRepository tutorAccountRepository,
            AdminAccountRepository adminAccountRepository,
            ScheduleRepository scheduleRepository,
            StudentAnnouncementVisibilityRepository studentAnnouncementVisibilityRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.studentAccountRepository = studentAccountRepository;
        this.tutorAccountRepository = tutorAccountRepository;
        this.adminAccountRepository = adminAccountRepository;
        this.scheduleRepository = scheduleRepository;
        this.studentAnnouncementVisibilityRepository = studentAnnouncementVisibilityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegistrationStatus signup(RegisterAccountDTO input) {

        String accountType = input.getType();

        Account account = new Account();
        account.setEmail(input.getEmail());

        account.setPassword(passwordEncoder.encode(input.getPassword()));

        if("ADMIN".equals(input.getType())) {

            account.setRole(Roles.ADMIN);

            AdminAccount adminAccount = new AdminAccount();
            adminAccount.setAccount(account);

            adminAccountRepository.save(adminAccount);
            System.out.println("New admin registered!");

            return RegistrationStatus.SUCCESS;
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setFirstName(input.getFirstName());
        userAccount.setLastName(input.getLastName());
        userAccount.setActive(true);
        userAccount.setSuspended(false);
        userAccount.setAccount(account);
        userAccount.setRecoveryToken(null);

        switch (accountType) {
            case "STUDENT" -> {
                Optional<StudentAccount> studentCheck = studentAccountRepository.findByEmail(input.getEmail());
                if (studentCheck.isPresent())
                    return RegistrationStatus.ACCOUNT_ALREADY_EXISTS;

                if(!input.getEmail().endsWith("etf.unibl.org")) {
                    return RegistrationStatus.INVALID_STUDENT_EMAIL;
                }

                Schedule schedule = new Schedule();
                scheduleRepository.save(schedule);

//                StudentAnnouncementVisibility studentAnnouncementVisibility = new StudentAnnouncementVisibility();
//                studentAnnouncementVisibilityRepository.save(studentAnnouncementVisibility);

                StudentAccount studentAccount = new StudentAccount();
                studentAccount.setUserAccount(userAccount);
                studentAccount.setSchedule(schedule);
                studentAccount.setStudentAnnouncementVisibility(null);
                userAccount.getAccount().setRole(Roles.STUDENT);

                studentAccountRepository.save(studentAccount);
                System.out.println("New student registered!");


                StudentAnnouncementVisibility studentAnnouncementVisibility = new StudentAnnouncementVisibility();
                studentAnnouncementVisibility.setStudentAccount(studentAccount);
                studentAnnouncementVisibility.setCanSeeYear1(true); // Default visibility settings
                studentAnnouncementVisibility.setCanSeeYear2(true);
                studentAnnouncementVisibility.setCanSeeYear3(true);
                studentAnnouncementVisibility.setCanSeeYear4(true);
                studentAnnouncementVisibility.setCanSeeMaster(false);
                studentAnnouncementVisibility.setCanSeeDoctorate(false);

                studentAnnouncementVisibilityRepository.save(studentAnnouncementVisibility);


            }
            case "TUTOR" -> {
                Optional<TutorAccount> tutorCheck = tutorAccountRepository.findByEmail(input.getEmail());
                if (tutorCheck.isPresent())
                    return RegistrationStatus.ACCOUNT_ALREADY_EXISTS;

                TutorAccount tutorAccount = new TutorAccount();
                tutorAccount.setUserAccount(userAccount);
                tutorAccount.setTutoringOffers(new ArrayList<>());
                userAccount.getAccount().setRole(Roles.TUTOR);

                tutorAccountRepository.save(tutorAccount);
                System.out.println("New tutor registered!");
            }
            default -> {
                System.out.println("WRONG USER TYPE FLAG!");
                return RegistrationStatus.INVALID_FLAG;
            }
        }

        return RegistrationStatus.SUCCESS;
    }

    public Account authenticate(LoginAccountDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return accountRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}