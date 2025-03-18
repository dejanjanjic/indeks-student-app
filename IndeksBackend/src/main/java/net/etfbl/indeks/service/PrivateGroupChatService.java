package net.etfbl.indeks.service;


import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import net.etfbl.indeks.dto.*;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.GroupRepository;
import net.etfbl.indeks.repository.PrivateGroupChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrivateGroupChatService {
    @Autowired
    private EntityManager entityManager;

    private final PrivateGroupChatMemberService privateGroupChatMemberService;

    private final PrivateGroupChatRepository privateGroupChatRepository;
    private final GroupRepository groupRepository;

    @Autowired
    PrivateGroupChatService(PrivateGroupChatRepository privateGroupChatRepository,GroupRepository groupRepository,
                            PrivateGroupChatMemberService privateGroupChatMemberService) {
        this.privateGroupChatRepository = privateGroupChatRepository;
        this.groupRepository=groupRepository;
        this.privateGroupChatMemberService = privateGroupChatMemberService;
    }

    public List<PrivateGroupChat> getPrivateGroupChats() {
        return privateGroupChatRepository.findAll();
    }

    public Optional<PrivateGroupChat> getGroup(Long groupId) {
        return privateGroupChatRepository.findById(groupId);
    }

    @Transactional
    public PrivateGroupChat addNewPrivateGroupChat(AddPrivateGroupChatDTO group) {
        return privateGroupChatRepository.save(new PrivateGroupChat(groupRepository.save(new GroupChat(group.getName()))));
    }

    public void addGroupMembers(AddPrivateGroupChatDTO group) {

        Optional<GroupChat> groupChat = groupRepository.findByName(group.getName());
        if(groupChat.isPresent()) {

            List<Long> membersIds = group.getMemberIds();

            for (Long membersId : membersIds) {

                AddPrivateGroupChatMemberDTO memberDTO = new AddPrivateGroupChatMemberDTO(groupChat.get().getId(), membersId);
                privateGroupChatMemberService.addNewPrivateGroupChatMember(memberDTO);

            }
        }
    }

    public boolean deleteGroup(Long groupId) {
        boolean exists = privateGroupChatRepository.existsById(groupId);
        if (!exists) {
           return false;
        }
        privateGroupChatRepository.deleteById(groupId);
        groupRepository.deleteById(groupId);

        return true;
    }

    @Transactional
    public List<MessageWithSenderDTO> getMessagesFromChat(Long chatId, Long userId) {

        PrivateGroupChat chat = entityManager.find(PrivateGroupChat.class, chatId);
        if (chat == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found");
        }

        UserAccount user = entityManager.find(UserAccount.class, userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        String queryStr = "SELECT m FROM Message m WHERE m.groupChat.id = :chatId ORDER BY m.time ASC";
        TypedQuery<Message> query = entityManager.createQuery(queryStr, Message.class);
        query.setParameter("chatId", chatId);
        List<Message> messages = query.getResultList();

        return messages.stream().map(message -> {
            boolean isSentByUser = message.getUserAccount().getId().equals(user.getId());
            String senderFullName = message.getUserAccount().getFirstName() + " " + message.getUserAccount().getLastName();
            return new MessageWithSenderDTO(
                    String.valueOf(message.getId()),
                    message.getText(),
                    message.getTime(),
                    isSentByUser,
                    senderFullName
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public boolean updatePrivateChatGroup(Long groupId, String groupName) {
        Optional<GroupChat> group = groupRepository.findById(groupId);
        if(group.isEmpty())
        {
            return false;
        }
        group.get().setName(groupName);
        return true;
    }
}
