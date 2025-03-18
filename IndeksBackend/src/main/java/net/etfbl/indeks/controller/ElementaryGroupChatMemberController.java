package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
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

    @GetMapping(path = "{elementaryGroupChatMemberId}")
    public ResponseEntity<Optional<ElementaryGroupChatMember>> getElementaryGroupChatMember(@PathVariable("elementaryGroupChatMemberId") Long elementaryGroupChatMemberId) {
        Optional<ElementaryGroupChatMember> elementaryGroupChatMember = elementaryGroupChatMemberService.getElementaryGroupChatMember(elementaryGroupChatMemberId);
        if (elementaryGroupChatMember.isPresent()) {
            return new ResponseEntity<>(elementaryGroupChatMember, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ElementaryGroupChatMember>> getElementaryGroupChatMembers() {
        List<ElementaryGroupChatMember> elementaryGroupChatMembers = elementaryGroupChatMemberService.getElementaryGroupChatMembers();
        return new ResponseEntity<>(elementaryGroupChatMembers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ElementaryGroupChatMember> addElementaryGroupChatMember(@RequestBody AddElementaryGroupChatMemberDTO elementaryGroupChatMemberDTO) {
        elementaryGroupChatMemberService.addNewElementaryGroupChatMember(elementaryGroupChatMemberDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}