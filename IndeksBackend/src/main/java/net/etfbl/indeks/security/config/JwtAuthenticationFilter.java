package net.etfbl.indeks.security.config;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.UserAccountRepository;
import net.etfbl.indeks.security.blacklisting.service.BlacklistedTokenService;
import net.etfbl.indeks.security.service.JwtService;
import net.etfbl.indeks.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserAccountService userAccountService;
    private final BlacklistedTokenService blacklistedTokenService;
    private final UserAccountRepository userAccountRepository;

    private String jwtToken;

    @Autowired
    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver,
            UserAccountService userAccountService,
            BlacklistedTokenService blacklistedTokenService,
            UserAccountRepository userAccountRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.userAccountService = userAccountService;
        this.blacklistedTokenService = blacklistedTokenService;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Authorization header is missing or does not start with 'Bearer '");
            filterChain.doFilter(request, response);
            return;
        }

        if(!authHeader.substring(7).isEmpty()) {

            String jwtToken = authHeader.substring(7);
            String userEmail = jwtService.extractEmail(jwtToken);

            Optional<UserAccount> userAccount = userAccountRepository.findByEmail(userEmail);
            if(userAccount.isPresent()) {
                if(!userAccount.get().getActive()) {
                    blacklistedTokenService.blacklistToken(jwtToken);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Error, this account has been suspended!\"}");
                    return;
                }
            }
        }

        if (request.getServletPath().equals("/api/v1/auth/register") || request.getServletPath().equals("/api/v1/auth/login")) {
            filterChain.doFilter(request, response);
            return;

        }

        try {
            final String jwtToken = authHeader.substring(7);
            this.jwtToken = jwtToken;

            if (blacklistedTokenService.isTokenBlacklisted(jwtToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Error, this token has been blacklisted. User is logged out!.\"}");
                return;
            }

            final String userEmail = jwtService.extractEmail(jwtToken);
            System.out.println("Extracted email: " + userEmail);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                System.out.println("Loaded UserDetails: " + userDetails.getUsername());



                if (jwtService.isTokenValid(jwtToken, userDetails)) {
                    System.out.println("Token is valid");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            jwtToken,
                            userDetails.getAuthorities()
                    );

                    System.out.println("Setting authentication with credentials: " + jwtToken);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException expiredJwtException) {
            String userEmail = jwtService.extractEmail(jwtToken);
            Optional<UserAccount> userAccount = userAccountService.getUserAccountByEmail(userEmail);
            userAccount.ifPresent(account -> account.setPushNotificationToken(null));
        }
        catch (Exception exception) {
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}