package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddElementaryGroupChatDTO;
import net.etfbl.indeks.dto.GetMessageDTO;
import net.etfbl.indeks.dto.GroupMessageDTO;
import net.etfbl.indeks.dto.MessageWithSenderDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.service.ElementaryGroupChatService;
import net.etfbl.indeks.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/elementaryGroup")
public class ElementaryGroupChatController {

    private final ElementaryGroupChatService elementaryGroupChatService;


    @Autowired
    private MessageService messageService;

    @Autowired
    public ElementaryGroupChatController(ElementaryGroupChatService elementaryGroupChatService) {
        this.elementaryGroupChatService = elementaryGroupChatService;
    }

    @GetMapping
    public ResponseEntity<List<ElementaryGroupChat>> getElementaryGroupChats() {
        System.out.println("test");
        List<ElementaryGroupChat> chats = elementaryGroupChatService.getElementaryGroupChats();
        if(!chats.isEmpty())
            System.out.println("dobar je");
        else
            System.out.println("nedobar je");
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @GetMapping(path = "{groupId}")
    public ResponseEntity<Optional<ElementaryGroupChat>> getElementaryGroupChat(@PathVariable("groupId") Long groupId) {
        Optional<ElementaryGroupChat> chat = elementaryGroupChatService.getGroup(groupId);
        if (chat.isPresent()) {
            return new ResponseEntity<>(chat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ElementaryGroupChat> registerNewElementaryGroupChat(@RequestBody AddElementaryGroupChatDTO group) {
        ElementaryGroupChat ElGroup = elementaryGroupChatService.addNewElementaryGroupChat(group);
        return new ResponseEntity<>(ElGroup, HttpStatus.OK);
    }

    @DeleteMapping(path = "{groupId}")
    public ResponseEntity deleteGroup(@PathVariable("groupId") Long groupId) {
        boolean isDeleted = elementaryGroupChatService.deleteGroup(groupId);
        if (isDeleted) {
            return new ResponseEntity( HttpStatus.OK);
        } else {
            return new ResponseEntity( HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(path = "{groupId}")
    public ResponseEntity updateGroup(
            @PathVariable("groupId") Long groupId,
            @RequestParam(required = false) String groupName) {
        boolean isUpdated = elementaryGroupChatService.updateElementaryChatGroup(groupId, groupName);
        if (isUpdated) {
            return new ResponseEntity( HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity( HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MessageWithSenderDTO>> getMessagesFromChat(@PathVariable Long chatId, @RequestParam Long userId) {
        List<MessageWithSenderDTO> messages = elementaryGroupChatService.getMessagesFromChat(chatId, userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/group/{groupChatId}")
    public ResponseEntity<List<GroupMessageDTO>> getMessagesFromGroup(@PathVariable Long groupChatId) {
        List<GroupMessageDTO> messages = messageService.getMessagesFromGroup(groupChatId);
        return ResponseEntity.ok(messages);
    }
}
