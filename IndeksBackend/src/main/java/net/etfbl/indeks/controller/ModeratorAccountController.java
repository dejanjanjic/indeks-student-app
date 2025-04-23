package net.etfbl.indeks.controller;

import lombok.RequiredArgsConstructor;
import net.etfbl.indeks.dto.AddModeratorDTO;
import net.etfbl.indeks.dto.UpdateModeratorDTO;
import net.etfbl.indeks.model.ModeratorAccount;
import net.etfbl.indeks.service.ModeratorAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/moderator")
@RequiredArgsConstructor
public class ModeratorAccountController {

    private final ModeratorAccountService moderatorAccountService;

    @GetMapping
    public ResponseEntity<List<ModeratorAccount>> getAllModerators() {
        return ResponseEntity.ok(moderatorAccountService.getAllModerators());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModeratorAccount> getModeratorById(@PathVariable Long id) {
        Optional<ModeratorAccount> moderator = moderatorAccountService.getModeratorAccountById(id);
        return moderator.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/material-path")
    public ResponseEntity<Long> getModeratorMaterialPath(@PathVariable Long id) {
        Optional<Long> path = moderatorAccountService.getModeratorMaterialPath(id).describeConstable();
        return path.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ModeratorAccount> addModerator(@RequestBody AddModeratorDTO dto) {
        ModeratorAccount moderatorAccount = moderatorAccountService.addModerator(dto);
        if(moderatorAccount != null) {
            return ResponseEntity.ok(moderatorAccount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModerator(@PathVariable Long id) {
        moderatorAccountService.deleteModerator(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModeratorAccount> updateModerator(@PathVariable Long id, @RequestBody UpdateModeratorDTO dto) {
        Optional<ModeratorAccount> existingModerator = moderatorAccountService.getModeratorAccountById(id);

        if (existingModerator.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ModeratorAccount updatedModerator = moderatorAccountService.updateModerator(id, dto);
        return ResponseEntity.ok(updatedModerator);
    }

}
