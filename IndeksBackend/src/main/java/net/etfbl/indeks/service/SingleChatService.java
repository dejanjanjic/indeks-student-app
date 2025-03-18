package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import net.etfbl.indeks.dto.*;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.SingleChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class SingleChatService {

    @Autowired
    private EntityManager entityManager;
    private final SingleChatRepository singleChatRepository;

    @Autowired
    public SingleChatService(SingleChatRepository singleChatRepository) {
        this.singleChatRepository = singleChatRepository;
    }

    public List<SingleChat> getSingleChats() {
        return singleChatRepository.findAll();
    }

    public Optional<SingleChat> getSingleChatById(Long id) {
        return singleChatRepository.findById(id);
    }

    @Transactional
    public SingleChatDTO addNewSingleChat(AddSingleChatDTO singleChatDTO) {

        UserAccount firstParticipant = Optional.ofNullable(entityManager.find(UserAccount.class, singleChatDTO.getFirstParticipantId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "First participant not found"));

        UserAccount secondParticipant = Optional.ofNullable(entityManager.find(UserAccount.class, singleChatDTO.getSecondParticipantId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Second participant not found"));

        // Check if a chat already exists between these users
        TypedQuery<SingleChat> query = entityManager.createQuery(
                "SELECT sc FROM SingleChat sc WHERE (sc.firstParticipant = :user1 AND sc.secondParticipant = :user2) " +
                        "OR (sc.firstParticipant = :user2 AND sc.secondParticipant = :user1)", SingleChat.class);
        query.setParameter("user1", firstParticipant);
        query.setParameter("user2", secondParticipant);

        List<SingleChat> existingChats = query.getResultList();
        if (!existingChats.isEmpty()) {
            SingleChat existingChat = existingChats.get(0);
            UserAccount otherUser = firstParticipant.getId().equals(singleChatDTO.getFirstParticipantId()) ? secondParticipant : firstParticipant;
            return new SingleChatDTO(existingChat.getId(), otherUser.getId(), otherUser.getFirstName()+" "+otherUser.getLastName());
        }

        // Create new chat if it doesn't exist
        SingleChat newSingleChat = new SingleChat(firstParticipant, secondParticipant);
        entityManager.persist(newSingleChat);

        UserAccount otherUser = firstParticipant.getId().equals(singleChatDTO.getFirstParticipantId()) ? secondParticipant : firstParticipant;

        return new SingleChatDTO(newSingleChat.getId(), otherUser.getId(), otherUser.getFirstName()+" "+otherUser.getLastName());
    }



    @Transactional
    public List<GetMessageDTO> getMessagesFromChat(Long chatId, Long userId) {


        SingleChat chat = entityManager.find(SingleChat.class, chatId);
        if (chat == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found");
        }


        UserAccount user = entityManager.find(UserAccount.class, userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }


        String queryStr = "SELECT m FROM Message m WHERE m.singleChat.id = :chatId ORDER BY m.time ASC";
        TypedQuery<Message> query = entityManager.createQuery(queryStr, Message.class);
        query.setParameter("chatId", chatId);
        List<Message> messages = query.getResultList();


        return messages.stream().map(message -> {
            boolean isSentByUser = message.getUserAccount().getId().equals(user.getId());
            return new GetMessageDTO(
                    String.valueOf(message.getId()),
                    message.getText(),
                    message.getTime(),
                    isSentByUser
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<SingleChatSummaryDTO> getAllChatsWithLastMessage(Long userId) {

        UserAccount user = entityManager.find(UserAccount.class, userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        // Fetch single chats
        String singleChatQueryStr = "SELECT c FROM SingleChat c WHERE c.firstParticipant = :user OR c.secondParticipant = :user";
        TypedQuery<SingleChat> singleChatQuery = entityManager.createQuery(singleChatQueryStr, SingleChat.class);
        singleChatQuery.setParameter("user", user);
        List<SingleChat> singleChats = singleChatQuery.getResultList();

        // Fetch elementary group chats
        String elementaryGroupChatQueryStr = "SELECT egc FROM ElementaryGroupChat egc WHERE EXISTS (SELECT 1 FROM ElementaryGroupChatMember egcm WHERE egcm.elementaryGroupChat.id = egc.id AND egcm.studentAccount.id = :userId)";
        TypedQuery<ElementaryGroupChat> elementaryGroupChatQuery = entityManager.createQuery(elementaryGroupChatQueryStr, ElementaryGroupChat.class);
        elementaryGroupChatQuery.setParameter("userId", userId);
        List<ElementaryGroupChat> elementaryGroupChats = elementaryGroupChatQuery.getResultList();

        // Fetch private group chats
        String privateGroupChatQueryStr = "SELECT pgc FROM PrivateGroupChat pgc WHERE EXISTS (SELECT 1 FROM PrivateGroupChatMember pgcm WHERE pgcm.privateGroupChat.id = pgc.id AND pgcm.userAccount.id = :userId)";
        TypedQuery<PrivateGroupChat> privateGroupChatQuery = entityManager.createQuery(privateGroupChatQueryStr, PrivateGroupChat.class);
        privateGroupChatQuery.setParameter("userId", userId);
        List<PrivateGroupChat> privateGroupChats = privateGroupChatQuery.getResultList();

        List<SingleChatSummaryDTO> chatSummaries = new ArrayList<>();

        // Processing SingleChats
        for (SingleChat chat : singleChats) {
            LastMessageInfo lastMessageInfo = getLastMessageFromChat(chat.getId());
            UserAccount otherParticipant = chat.getFirstParticipant().equals(user) ? chat.getSecondParticipant() : chat.getFirstParticipant();
            chatSummaries.add(new SingleChatSummaryDTO(
                    String.valueOf(chat.getId()),
                    otherParticipant.getFirstName() + " " + otherParticipant.getLastName(),
                    lastMessageInfo.getSender(),
                    lastMessageInfo.getMessage(),
                    false,
                    false // Not an elementary group
            ));
        }

        // Processing ElementaryGroupChats
        for (ElementaryGroupChat chat : elementaryGroupChats) {
            LastMessageInfo lastMessageInfo = getLastMessageFromChat(chat.getId());
            String groupName = chat.getGroupChat().getName();
            chatSummaries.add(new SingleChatSummaryDTO(
                    String.valueOf(chat.getId()),
                    groupName,
                    lastMessageInfo.getSender(),
                    lastMessageInfo.getMessage(),
                    true,
                    true // This is an elementary group
            ));
        }

        // Processing PrivateGroupChats
        for (PrivateGroupChat chat : privateGroupChats) {
            LastMessageInfo lastMessageInfo = getLastMessageFromChat(chat.getId());
            String groupName = chat.getGroupChat().getName();
            chatSummaries.add(new SingleChatSummaryDTO(
                    String.valueOf(chat.getId()),
                    groupName,
                    lastMessageInfo.getSender(),
                    lastMessageInfo.getMessage(),
                    true,
                    false // Not an elementary group
            ));
        }

        // Sorting chat summaries by the newest message first
        chatSummaries.sort((c1, c2) -> {
            LastMessageInfo lastMessageInfo1 = getLastMessageFromChat(Long.valueOf(c1.getId()));
            LastMessageInfo lastMessageInfo2 = getLastMessageFromChat(Long.valueOf(c2.getId()));
            return lastMessageInfo2.getMessageTime().compareTo(lastMessageInfo1.getMessageTime());
        });

        return chatSummaries;
    }


    @Transactional
    public ResponseEntity<Long> doesSingleChatExist(Long firstParticipantId, Long secondParticipantId) {
        // Fetch the users
        UserAccount firstParticipant = entityManager.find(UserAccount.class, firstParticipantId);
        UserAccount secondParticipant = entityManager.find(UserAccount.class, secondParticipantId);

        if (firstParticipant == null || secondParticipant == null) {

            return ResponseEntity.ok(null);
        }

        // Check if a SingleChat exists
        String queryStr = "SELECT c.id FROM SingleChat c WHERE (c.firstParticipant = :firstParticipant AND c.secondParticipant = :secondParticipant) OR (c.firstParticipant = :secondParticipant AND c.secondParticipant = :firstParticipant)";
        TypedQuery<Long> query = entityManager.createQuery(queryStr, Long.class);
        query.setParameter("firstParticipant", firstParticipant);
        query.setParameter("secondParticipant", secondParticipant);

        List<Long> result = query.getResultList();

        if (result.isEmpty()) {
            // Returning 200 OK with 'null' if chat doesn't exist
            return ResponseEntity.ok(null);
        }

        // Returning the SingleChat ID if the chat exists
        return ResponseEntity.ok(result.get(0));
    }
    private LastMessageInfo getLastMessageFromChat(Long chatId) {

        String messageQueryStr = "SELECT m FROM Message m WHERE m.singleChat.id = :chatId OR m.groupChat.id = :chatId ORDER BY m.time DESC";
        TypedQuery<Message> messageQuery = entityManager.createQuery(messageQueryStr, Message.class);
        messageQuery.setParameter("chatId", chatId);
        messageQuery.setMaxResults(1);
        List<Message> messages = messageQuery.getResultList();

        if (messages.isEmpty()) {
            return new LastMessageInfo("", "", "");
        }

        Message lastMessage = messages.get(0);
        String messageText = lastMessage.getText();
        UserAccount sender = lastMessage.getUserAccount();
        String messageTime = lastMessage.getTime().toString(); // Assuming `time` is a `Date` or `LocalDateTime`.

        return new LastMessageInfo(messageText, sender.getFirstName() + " " + sender.getLastName(), messageTime);
    }



    public boolean deleteSingleChat(Long id) {
        boolean exists = singleChatRepository.existsById(id);
        if (exists) {
            singleChatRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
