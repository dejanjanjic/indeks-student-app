package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.dto.UserAccountDetailsDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.ElementaryGroupChatMember;
import net.etfbl.indeks.service.ElementaryGroupChatMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/elementaryGroupChatMember")
public class ElementaryGroupChatMemberController {

    private final ElementaryGroupChatMemberService elementaryGroupChatMemberService;
    @Autowired
    public ElementaryGroupChatMemberController(ElementaryGroupChatMemberService elementaryGroupChatMemberService) {
        this.elementaryGroupChatMemberService = elementaryGroupChatMemberService;
    }

    @GetMapping(path = "{accountId}/elementaryGroup/{elementaryGroupChatId}")
    public ResponseEntity<Boolean> isAccountIdMemberOfElementaryGroupChat(
            @PathVariable("accountId") Long accountId,
            @PathVariable("elementaryGroupChatId") Long elementaryGroupChatId) {

        boolean isMember = elementaryGroupChatMemberService.isStudentElementaryGroupChatMember(accountId, elementaryGroupChatId);

        return ResponseEntity.ok(isMember);
    }


    @GetMapping
    public ResponseEntity<List<ElementaryGroupChatMember>> getElementaryGroupChatMembers() {
        List<ElementaryGroupChatMember> elementaryGroupChatMembers = elementaryGroupChatMemberService.getElementaryGroupChatMembers();
        return new ResponseEntity<>(elementaryGroupChatMembers, HttpStatus.OK);
    }

    @GetMapping(path = "{groupId}")
    public ResponseEntity<List<UserAccountDetailsDTO>> getElementaryGroupChatMembersByGroupId(@PathVariable("groupId") Long groupId) {
        return ResponseEntity.ok(elementaryGroupChatMemberService.getElementaryGroupChatMembersByGroupId(groupId));
    }

    @GetMapping("{groupId}/filter/{keyword}")
    public ResponseEntity<List<UserAccountDetailsDTO>> filterElementaryGroupChatMembersByGroupId(@PathVariable("groupId") Long groupId, @PathVariable("keyword") String keyword){
        return ResponseEntity.ok(elementaryGroupChatMemberService.filterElementaryGroupChatMembersByGroupId(groupId, keyword));
    }

    @PostMapping
    public ResponseEntity<ElementaryGroupChatMember> addElementaryGroupChatMember(@RequestBody AddElementaryGroupChatMemberDTO elementaryGroupChatMemberDTO) {
        elementaryGroupChatMemberService.addNewElementaryGroupChatMember(elementaryGroupChatMemberDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("{groupId}/{userAccountId}")
    public ResponseEntity<Void> delete(@PathVariable("groupId")Long groupId, @PathVariable("userAccountId") Long userAccountId){
        return elementaryGroupChatMemberService.delete(groupId, userAccountId) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}