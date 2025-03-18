package net.etfbl.indeks.service;


import net.etfbl.indeks.dto.BlockedUserDTO;
import net.etfbl.indeks.model.BlockedAccount;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.BlockedAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlockedAccountService {
    private final BlockedAccountRepository blockedAccountRepository;

    public BlockedAccountService(BlockedAccountRepository blockedAccountRepository) {
        this.blockedAccountRepository = blockedAccountRepository;
    }

    public List<BlockedUserDTO> getBlockedUsers(Long userId) {
        List<BlockedAccount> blockedAccounts = blockedAccountRepository.findByUserAccountId(userId);
        return blockedAccounts.stream()
                .map(blockedAccount -> new BlockedUserDTO(
                        blockedAccount.getBlockedUser().getId(),  // Add blocked user ID
                        blockedAccount.getBlockedUser().getFirstName(),
                        blockedAccount.getBlockedUser().getLastName(),
                        blockedAccount.getDateBlocked()
                ))
                .collect(Collectors.toList());
    }


    public BlockedAccount blockUser(Long userId, Long blockedUserId) {
        BlockedAccount blockedAccount = new BlockedAccount();
        blockedAccount.setUserAccount(new UserAccount());
        blockedAccount.getUserAccount().setId(userId);
        blockedAccount.setBlockedUser(new UserAccount());
        blockedAccount.getBlockedUser().setId(blockedUserId);
        blockedAccount.setDateBlocked(LocalDateTime.now());
        return blockedAccountRepository.save(blockedAccount);
    }

    public boolean isBlocked(Long userId, Long otherUserId) {
        boolean userBlockedOther = blockedAccountRepository.existsByUserAccountIdAndBlockedUserId(userId, otherUserId);
        boolean otherBlockedUser = blockedAccountRepository.existsByUserAccountIdAndBlockedUserId(otherUserId, userId);
        return userBlockedOther || otherBlockedUser;
    }

    @Transactional
    public void unblockUser(Long userId, Long blockedUserId) {
        blockedAccountRepository.deleteByUserAccountIdAndBlockedUserId(userId, blockedUserId);
    }
}
