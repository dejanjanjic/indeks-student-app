package net.etfbl.indeks.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import net.etfbl.indeks.model.*;
import net.etfbl.indeks.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final AccountService accountService;
    private final AdminAccountService adminAccountService;
    private final StudentAccountService studentAccountService;
    private final TutorAccountService tutorAccountService;
    private final ModeratorAccountService moderatorAccountService;

    @Autowired
    public JwtService(AccountService accountService, AdminAccountService adminAccountService,
                      StudentAccountService studentAccountService, TutorAccountService tutorAccountService, ModeratorAccountService moderatorAccountService) {
        this.accountService = accountService;
        this.adminAccountService = adminAccountService;
        this.studentAccountService = studentAccountService;
        this.tutorAccountService = tutorAccountService;
        this.moderatorAccountService = moderatorAccountService;
    }

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 3)) // npr. 3x duži rok važenja
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public long getExpirationTime() {
        return jwtExpiration;
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {

        System.out.println("userDetails username: " + userDetails.getUsername());
        Optional<Account> account = accountService.getAccountByEMail(userDetails.getUsername());
        account.ifPresent(value -> extraClaims.put("accountId", value.getId()));

        String firstName = "";
        String lastName = "";
        String accountType = "";

        Optional<AdminAccount> adminAccount = adminAccountService.getAdminAccountById(account.get().getId());
        if(adminAccount.isPresent()) {
            firstName = "admin";
            accountType = "ADMIN";
        }

        Optional<StudentAccount> studentAccount = studentAccountService.getStudentAccountById(account.get().getId());
        if(studentAccount.isPresent()) {
            firstName = studentAccount.get().getUserAccount().getFirstName();
            lastName = studentAccount.get().getUserAccount().getLastName();
            accountType = "STUDENT";
        }

        Optional<TutorAccount> tutorAccount = tutorAccountService.getTutorAccountById(account.get().getId());
        if(tutorAccount.isPresent()) {
            firstName = tutorAccount.get().getUserAccount().getFirstName();
            lastName = tutorAccount.get().getUserAccount().getLastName();
            accountType = "TUTOR";
        }

        Optional<ModeratorAccount> moderatorAccount = moderatorAccountService.getModeratorAccountById(account.get().getId());
        if(moderatorAccount.isPresent()) {
            firstName = moderatorAccount.get().getFirstName();
            lastName = moderatorAccount.get().getLastName();
            accountType = "MODERATOR";
        }

        extraClaims.put("firstName", firstName);
        extraClaims.put("lastName", lastName);
        extraClaims.put("accountType", accountType);

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}