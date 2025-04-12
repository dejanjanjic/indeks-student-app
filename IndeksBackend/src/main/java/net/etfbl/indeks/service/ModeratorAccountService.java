package net.etfbl.indeks.service;

import lombok.RequiredArgsConstructor;
import net.etfbl.indeks.dto.AddModeratorDTO;
import net.etfbl.indeks.dto.UpdateModeratorDTO;
import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.ModeratorAccount;
import net.etfbl.indeks.repository.AccountRepository;
import net.etfbl.indeks.repository.ModeratorAccountRepository;
import net.etfbl.indeks.security.enumeration.Roles;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ModeratorAccountService {

    private final ModeratorAccountRepository moderatorAccountRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ModeratorAccount> getAllModerators() {
        return moderatorAccountRepository.findAll();
    }

    public Optional<ModeratorAccount> getModeratorById(Long id) {
        return moderatorAccountRepository.findById(id);
    }

    @Transactional
    public ModeratorAccount addModerator(AddModeratorDTO dto) {
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setRole(Roles.MODERATOR);

        account = accountRepository.save(account);

        ModeratorAccount moderator = new ModeratorAccount();
        moderator.setFirstName(dto.getFirstName());
        moderator.setLastName(dto.getLastName());
        moderator.setMaterialPath(dto.getMaterialPath());
        moderator.setAccount(account);

        return moderatorAccountRepository.save(moderator);
    }

    @Transactional
    public ModeratorAccount updateModerator(Long id, UpdateModeratorDTO dto) {
        Optional<ModeratorAccount> existingModerator = moderatorAccountRepository.findById(id);

        if (existingModerator.isEmpty()) {
            throw new IllegalArgumentException("Moderator not found");
        }

        ModeratorAccount moderator = existingModerator.get();
        moderator.setMaterialPath(dto.getMaterialPath());

        return moderatorAccountRepository.save(moderator);
    }


    public void deleteModerator(Long id) {
        moderatorAccountRepository.deleteById(id);
    }
}