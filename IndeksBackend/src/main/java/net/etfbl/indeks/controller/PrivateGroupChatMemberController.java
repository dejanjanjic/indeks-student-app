package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.dto.AddPrivateGroupChatMemberDTO;
import net.etfbl.indeks.model.ElementaryGroupChatMember;
import net.etfbl.indeks.model.PrivateGroupChatMember;
import net.etfbl.indeks.service.ElementaryGroupChatMemberService;
import net.etfbl.indeks.service.PrivateGroupChatMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(path = "api/v1/privateGroupChatMember")
public class PrivateGroupChatMemberController {

    private final PrivateGroupChatMemberService privateGroupChatMemberService;
    @Autowired
    public PrivateGroupChatMemberController(PrivateGroupChatMemberService privateGroupChatMemberService) {
        this.privateGroupChatMemberService = privateGroupChatMemberService;
    }

    @GetMapping(path = "{privateGroupChatMemberId}")
    public ResponseEntity<Optional<PrivateGroupChatMember>> getPrivateGroupChatMember(@PathVariable("privateGroupChatMemberId") Long elementaryGroupChatMemberId) {
        Optional<PrivateGroupChatMember> privateGroupChatMember = privateGroupChatMemberService.getPrivateGroupChatMember(elementaryGroupChatMemberId);
        if (privateGroupChatMember.isPresent()) {
            return new ResponseEntity<>(privateGroupChatMember, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PrivateGroupChatMember>> getPrivateGroupChatMembers() {
        List<PrivateGroupChatMember> privateGroupChatMember = privateGroupChatMemberService.getPrivateGroupChatMembers();
        return new ResponseEntity<>(privateGroupChatMember, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PrivateGroupChatMember> addPrivateGroupChatMember(@RequestBody AddPrivateGroupChatMemberDTO privateGroupChatMemberDTO) {

        System.out.println("uslo");

        privateGroupChatMemberService.addNewPrivateGroupChatMember(privateGroupChatMemberDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping(path = "{privateGroupChatMemberId}")
    public ResponseEntity<Void> deleteElementaryGroupChatMember(@PathVariable("privateGroupChatMemberId") Long privateGroupChatMemberId) {
        boolean deleted = privateGroupChatMemberService.deletePrivateGroupChatMember(privateGroupChatMemberId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/novi/{groupChatId}")
    public ResponseEntity<List<Long>> getMembersByGroupChatId(@PathVariable Long groupChatId) {
        List<Long> members = privateGroupChatMemberService.getMembersByGroupChatId(groupChatId);
        return ResponseEntity.ok(members);
    }

}
