package net.etfbl.indeks.service;



import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import net.etfbl.indeks.dto.*;
import net.etfbl.indeks.model.*;

import net.etfbl.indeks.repository.ElementaryGroupChatRepository;
import net.etfbl.indeks.repository.GroupRepository;
import net.etfbl.indeks.repository.UserAccountRepository;
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
public class ElementaryGroupChatService {

    @Autowired
    private EntityManager entityManager;
    private final ElementaryGroupChatRepository elementaryGroupChatRepository;
    private final GroupRepository groupRepository;

    @Autowired
    private UserAccountRepository userAccountRepository; // Inject UserAccountRepository
    @Autowired
    private ElementaryGroupChatMemberService elementaryGroupChatMemberService;


    @Autowired
    ElementaryGroupChatService(ElementaryGroupChatRepository elementaryGroupChatRepository,GroupRepository groupRepository) {
        this.elementaryGroupChatRepository = elementaryGroupChatRepository;
        this.groupRepository=groupRepository;
    }

    public List<ElementaryGroupChat> getElementaryGroupChats() {
        return elementaryGroupChatRepository.findAll();
    }

    public Optional<ElementaryGroupChat> getGroup(Long groupId) {
        return elementaryGroupChatRepository.findById(groupId);
    }

    @Transactional
    public ElementaryGroupChat addNewElementaryGroupChat(AddElementaryGroupChatDTO group) {
        if(groupRepository.existsGroupChatByName(group.getName())){
            return null;
        }
        GroupChat savedGroupChat = groupRepository.save(new GroupChat(group.getName()));
        //addAllUsersToGroup(newElementaryGroupChat); // Add all UserAccounts to the group
        return elementaryGroupChatRepository.save(new ElementaryGroupChat(savedGroupChat));
    }

    private void addAllUsersToGroup(ElementaryGroupChat elementaryGroupChat) {
        List<UserAccount> allUsers = userAccountRepository.findAll();
        for (UserAccount user : allUsers) {
            AddElementaryGroupChatMemberDTO memberDTO = new AddElementaryGroupChatMemberDTO(
                    elementaryGroupChat.getId(), user.getId()
            );
            elementaryGroupChatMemberService.addNewElementaryGroupChatMember(memberDTO);
        }
    }
    @Transactional
    public List<MessageWithSenderDTO> getMessagesFromChat(Long chatId, Long userId) {

        ElementaryGroupChat chat = entityManager.find(ElementaryGroupChat.class, chatId);
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


    public boolean deleteGroup(Long groupId) {
        boolean exists = elementaryGroupChatRepository.existsById(groupId);
        if (!exists) {
            return false;
        }
        elementaryGroupChatRepository.deleteById(groupId);
        groupRepository.deleteById(groupId);
        return exists;
    }

    @Transactional
    public boolean updateElementaryChatGroup(Long groupId, String groupName) {
        Optional<GroupChat> group = groupRepository.findById(groupId);
        if(group.isEmpty())
        {
            return false;
        }
        group.get().setName(groupName);
        return true;
    }

    public List<ElementaryGroupChatBasicInfoDTO> getAllInfo() {
        List<ElementaryGroupChatBasicInfoDTO> temp = elementaryGroupChatRepository
                .findAll()
                .stream()
                .map(ElementaryGroupChatBasicInfoDTO::new)
                .toList();
        temp.forEach(e -> e.setSize(elementaryGroupChatMemberService.getElementaryGroupChatSize(e.getId())));
        return temp;
    }

    public List<ElementaryGroupChatBasicInfoDTO> getByKeyword(String keyword) {
        List<ElementaryGroupChatBasicInfoDTO> temp = elementaryGroupChatRepository
                .findAllByGroupChat_NameContains(keyword)
                .stream()
                .map(ElementaryGroupChatBasicInfoDTO::new)
                .toList();
        temp.forEach(e -> e.setSize(elementaryGroupChatMemberService.getElementaryGroupChatSize(e.getId())));
        return temp;
    }
}