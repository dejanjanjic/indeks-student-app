package net.etfbl.indeks.controller;

import jakarta.persistence.EntityNotFoundException;
import net.etfbl.indeks.dto.BlockedUserDTO;
import net.etfbl.indeks.model.BlockedAccount;
import net.etfbl.indeks.model.SingleChat;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.SingleChatRepository;
import net.etfbl.indeks.repository.UserAccountRepository;
import net.etfbl.indeks.service.BlockedAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blocked-accounts")
public class BlockedAccountController {
    private final BlockedAccountService blockedAccountService;
    @Autowired
    private SingleChatRepository singleChatRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;


    public BlockedAccountController(BlockedAccountService blockedAccountService) {
        this.blockedAccountService = blockedAccountService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<BlockedUserDTO>> getBlockedUsers(@PathVariable Long userId) {
        return ResponseEntity.ok(blockedAccountService.getBlockedUsers(userId));
    }

    @PostMapping("/block/chat/{currentUserId}/{singleChatId}")
    public ResponseEntity<BlockedAccount> blockUserInChat(
            @PathVariable Long currentUserId,
            @PathVariable Long singleChatId) {

        // Fetch the SingleChat by its ID
        SingleChat singleChat = singleChatRepository.findById(singleChatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        // Determine the other user in the chat
        UserAccount currentUser = userAccountRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        UserAccount otherUser = singleChat.getOtherUser(currentUser);

        // Block the other user
        BlockedAccount blockedAccount = blockedAccountService.blockUser(currentUserId, otherUser.getId());
        return ResponseEntity.ok(blockedAccount);
    }

    @DeleteMapping("/unblock/chat/{currentUserId}/{blockedUserId}")
    public ResponseEntity<Void> unblockUserInChat(
            @PathVariable Long currentUserId,
            @PathVariable Long blockedUserId) {

        // Fetch the SingleChat by its ID

        UserAccount currentUser = userAccountRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        UserAccount bloeckedUser = userAccountRepository.findById(blockedUserId)
                .orElseThrow(()->new EntityNotFoundException("User not found"));

        // Unblock the other user
        blockedAccountService.unblockUser(currentUserId, blockedUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/is-blocked/{currentUserId}/{singleChatId}")
    public ResponseEntity<Boolean> isUserBlockedInChat(
            @PathVariable Long currentUserId,
            @PathVariable Long singleChatId) {

        // Fetch the SingleChat by its ID
        SingleChat singleChat = singleChatRepository.findById(singleChatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        // Fetch the current user
        UserAccount currentUser = userAccountRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Determine the other user in the chat
        UserAccount otherUser = singleChat.getOtherUser(currentUser);

        // Check if either user has blocked the other
        boolean isBlocked = blockedAccountService.isBlocked(currentUserId, otherUser.getId());
        return ResponseEntity.ok(isBlocked);
    }

}
