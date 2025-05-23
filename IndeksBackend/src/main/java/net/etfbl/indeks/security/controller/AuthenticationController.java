package net.etfbl.indeks.security.controller;

import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.security.blacklisting.service.BlacklistedTokenService;
import net.etfbl.indeks.security.dto.LoginAccountDTO;
import net.etfbl.indeks.security.dto.RefreshTokenDTO;
import net.etfbl.indeks.security.dto.RegisterAccountDTO;
import net.etfbl.indeks.security.enumeration.RegistrationStatus;
import net.etfbl.indeks.security.service.AuthenticationService;
import net.etfbl.indeks.security.service.JwtService;
import net.etfbl.indeks.service.AccountService;
import net.etfbl.indeks.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/v1/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final BlacklistedTokenService blacklistedTokenService;
    private final UserAccountService userAccountService;
    private final AccountService accountService;

    @Autowired
    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService,
                                    BlacklistedTokenService blacklistedTokenService,
                                    UserAccountService userAccountService, AccountService accountService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.blacklistedTokenService = blacklistedTokenService;
        this.userAccountService = userAccountService;
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterAccountDTO registerUserDto) {
        RegistrationStatus registrationStatus = authenticationService.signup(registerUserDto);

        switch (registrationStatus) {
            case SUCCESS -> {
                return ResponseEntity.ok(Map.of("message", "Registration successful!"));
            }
            case INVALID_FLAG -> {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid account type flag provided in the request."));
            }
            case ACCOUNT_ALREADY_EXISTS -> {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Account already exists. Please try logging in."));
            }
            case INVALID_STUDENT_EMAIL -> {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid email domain for student account."));
            }
            default -> {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Unexpected error occurred."));
            }
        }
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> authenticate(@RequestBody LoginAccountDTO loginUserDto) {
//
//        if (userAccountService.checkActiveStatus(loginUserDto.getEmail())) {
//            Account authenticatedUser = authenticationService.authenticate(loginUserDto);
//            String jwtToken = jwtService.generateToken(authenticatedUser);
//
//            LoginResponse loginResponse = new LoginResponse();
//            loginResponse.setToken(jwtToken);
//
//            return ResponseEntity.ok(loginResponse);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", "Error, this account has been suspended!"));
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginAccountDTO loginUserDto) {
        if (userAccountService.checkActiveStatus(loginUserDto.getEmail())) {
            Account authenticatedUser = authenticationService.authenticate(loginUserDto);

            String accessToken = jwtService.generateToken(authenticatedUser);
            String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(accessToken);
            loginResponse.setRefreshToken(refreshToken);

            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Error, this account has been suspended!"));
        }
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenDTO request) {
        String refreshToken = request.getRefreshToken();
        try {
            String userEmail = jwtService.extractUsername(refreshToken);
            Account account = accountService.getAccountByEMail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (jwtService.isTokenValid(refreshToken, account)) {
                String newAccessToken = jwtService.generateToken(account);
                String newRefreshToken = jwtService.generateRefreshToken(account);
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setToken(newAccessToken);
                loginResponse.setRefreshToken(newRefreshToken);
                return ResponseEntity.ok(loginResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh token error"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String jwtToken = (String) authentication.getCredentials();
            blacklistedTokenService.blacklistToken(jwtToken);

            String userEmail = jwtService.extractEmail(jwtToken);
            Optional<UserAccount> userAccount = userAccountService.getUserAccountByEmail(userEmail);
            userAccount.ifPresent(account -> account.setPushNotificationToken(null));

            return ResponseEntity.ok(Map.of("message", "Logout successful!"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));
    }
}