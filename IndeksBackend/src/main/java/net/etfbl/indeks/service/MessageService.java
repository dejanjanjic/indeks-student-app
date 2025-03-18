package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import net.etfbl.indeks.dto.AddMessageDTO;
import net.etfbl.indeks.dto.GroupMessageDTO;
import net.etfbl.indeks.dto.SingleChatSummaryDTO;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.MessageRepository;
import net.etfbl.indeks.repository.UserAccountRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private EntityManager entityManager;
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }
//TO DO: NAPRAVITII ZA GRUPE ISTO SLATI!!!!!


    @Transactional
    public Message addNewMessage(AddMessageDTO addMessageDTO) {
        UserAccount sender = entityManager.find(UserAccount.class, addMessageDTO.getUserAccountId());
        if (sender == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found");
        }

        SingleChat singleChat = null;
        GroupChat groupChat = null;
        Message message = null;

        if (addMessageDTO.getSingleChatId() != null) {
            singleChat = entityManager.find(SingleChat.class, addMessageDTO.getSingleChatId());
        }
        if(addMessageDTO.getGroupChatId()!=null)
        {
            groupChat = entityManager.find(GroupChat.class, addMessageDTO.getGroupChatId());
        }


        // Create and persist the message
        message = new Message(
                addMessageDTO.getText(),
                singleChat,
                groupChat,
                addMessageDTO.getStatus(),
                sender
        );


        entityManager.persist(message);

        if (singleChat != null) {
            // Handle single chat message
            UserAccount recipient = singleChat.getOtherUser(sender);
            if (recipient != null) {
                SingleChatSummaryDTO summary = new SingleChatSummaryDTO(
                        singleChat.getId().toString(),
                        sender.getFirstName() + " " + sender.getLastName(), // Not applicable for single chats
                        sender.getFirstName() + " " + sender.getLastName(),
                        message.getText(),
                        false, // Not a group chat
                        false // Not an elementary group chat
                );

                sendNotificationToUser(
                        recipient.getPushNotificationToken(),
                        summary.getSender(),
                        summary.getLastMessage(),summary
                );
            }
        }

        if (groupChat != null) {
            long groupChatId = addMessageDTO.getGroupChatId();

            PrivateGroupChat privateGroupChat = entityManager.find(PrivateGroupChat.class, groupChatId);

            if (privateGroupChat != null) {
                List<PrivateGroupChatMember> privateGroupMembers = entityManager
                        .createQuery("SELECT m FROM PrivateGroupChatMember m WHERE m.privateGroupChat.id = :groupChatId", PrivateGroupChatMember.class)
                        .setParameter("groupChatId", groupChatId)
                        .getResultList();

                for (PrivateGroupChatMember member : privateGroupMembers) {
                    UserAccount memberAccount = member.getUserAccount();
                    if (!memberAccount.equals(sender)) { // Skip sending notification to the sender
                        SingleChatSummaryDTO summary = new SingleChatSummaryDTO(
                                privateGroupChat.getId().toString(),
                                privateGroupChat.getGroupChat().getName(),
                                sender.getFirstName() + " " + sender.getLastName(),
                                message.getText(),
                                true, // This is a group chat
                                false // Not an elementary group chat
                        );

                        sendNotificationToUser(
                                memberAccount.getPushNotificationToken(),
                                summary.getName(),
                                summary.getLastMessage(), summary
                        );
                    }
                }
            } else {
                ElementaryGroupChat elementaryGroupChat = entityManager.find(ElementaryGroupChat.class, groupChatId);

                if (elementaryGroupChat != null) {
                    List<ElementaryGroupChatMember> elementaryGroupMembers = entityManager
                            .createQuery("SELECT m FROM ElementaryGroupChatMember m WHERE m.elementaryGroupChat.id = :groupChatId", ElementaryGroupChatMember.class)
                            .setParameter("groupChatId", groupChatId)
                            .getResultList();

                    for (ElementaryGroupChatMember member : elementaryGroupMembers) {
                        UserAccount studentAccount = member.getStudentAccount().getUserAccount();
                        if (!studentAccount.equals(sender)) { // Skip sending notification to the sender
                            SingleChatSummaryDTO summary = new SingleChatSummaryDTO(
                                    elementaryGroupChat.getId().toString(),
                                    elementaryGroupChat.getGroupChat().getName(),
                                    sender.getFirstName() + " " + sender.getLastName(),
                                    message.getText(),
                                    true, // This is a group chat
                                    true // This is an elementary group chat
                            );

                            sendNotificationToUser(
                                    studentAccount.getPushNotificationToken(),
                                    summary.getName(),
                                    summary.getLastMessage(), summary
                            );
                        }
                    }
                } else {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group chat not found");
                }
            }
        }

        return message;
    }



    private void sendNotificationToUser(String pushToken, String title, String body, SingleChatSummaryDTO chatSummary) {
        try {
            PushNotificationService pushNotificationService = new PushNotificationService();
            pushNotificationService.sendPushNotification(pushToken, title, body, "message", chatSummary);
        } catch (IOException e) {
            e.printStackTrace(); // Handle exception as needed
        }
    }



    public boolean deleteMessage(Long id) {
        boolean exists = messageRepository.existsById(id);
        if (exists) {
            messageRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean updateMessage(Long id, String text) {
        Optional<Message> message = messageRepository.findById(id);
        if(message.isPresent() && !text.isEmpty() && !message.get().getText().equals(text)) {
            message.get().setText(text);
            return true;
        }
        return false;
    }





    @Autowired
    private UserAccountRepository userAccountRepository;

    public List<GroupMessageDTO> getMessagesFromGroup(Long groupChatId) {
        List<Message> messages = messageRepository.findByGroupChatIdOrderByTimeAsc(groupChatId);
        List<GroupMessageDTO> messageDTOs = new ArrayList<>();

        for (Message message : messages) {
            String senderFullName = message.getUserAccount().getFirstName() + " " + message.getUserAccount().getLastName();
            String groupChatName = message.getGroupChat().getName();
            GroupMessageDTO dto = new GroupMessageDTO(
                    message.getId(),
                    message.getText(),
                    message.getTime(),
                    senderFullName,  // Set full name here
                    groupChatName,
                    message.getStatus()
            );
            messageDTOs.add(dto);
        }

        return messageDTOs;
    }
}
