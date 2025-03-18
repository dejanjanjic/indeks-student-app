package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.DeleteGroupChatMemberDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.GroupChat;
import net.etfbl.indeks.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/group")
public class GroupController {
    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }


    @GetMapping
    public ResponseEntity<List<GroupChat>> getGroups() {
        List<GroupChat> groups = groupService.getGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @GetMapping(path = "{groupId}")
    public ResponseEntity<Optional<GroupChat>> getGroup(@PathVariable("groupId")Long groupId) {
        Optional<GroupChat> chat = groupService.getGroup(groupId);
        if (chat.isPresent()) {
            return new ResponseEntity<>(chat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<GroupChat> registerNewGroup(@RequestBody GroupChat group)
    {
        groupService.addNewGrupa(group);
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    @DeleteMapping(path = "{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable("groupId") Long groupId) {
        boolean isDeleted = groupService.deleteGroup(groupId);
        if (isDeleted) {
            return new ResponseEntity<>( HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping(path = "{groupId}")
    public ResponseEntity<?> updateGroup(
            @PathVariable("groupId") Long groupId,
            @RequestParam(required = false) String groupName) {
        boolean isUpdated = groupService.updateGroup(groupId, groupName);
        if (isUpdated) {
            return new ResponseEntity<>( HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/removeMember")
    public ResponseEntity<String> removeUserFromGroup(@RequestBody DeleteGroupChatMemberDTO memberDTO) {

        boolean removed = groupService.removeUserFromGroup(memberDTO.getGroupChatId(), memberDTO.getAccountId());
        if (removed) {
            return new ResponseEntity<>("User removed successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found in any group.", HttpStatus.NOT_FOUND);
        }
    }
}
