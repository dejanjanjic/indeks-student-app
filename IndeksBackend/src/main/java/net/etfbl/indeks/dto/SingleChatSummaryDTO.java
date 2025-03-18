package net.etfbl.indeks.dto;

public class SingleChatSummaryDTO {

    private String id;
    private String name;
    private String sender;
    private String lastMessage;
    private boolean isGroup; // This field already tracks group chats
    private boolean isElementaryGroup; // New field for elementary group chats

    // Constructors, getters, and setters

    public SingleChatSummaryDTO(String id, String name, String sender, String lastMessage, boolean isGroup, boolean isElementaryGroup) {
        this.id = id;
        this.name = name;
        this.sender = sender;
        this.lastMessage = lastMessage;
        this.isGroup = isGroup; // Initialize the isGroup field
        this.isElementaryGroup = isElementaryGroup; // Initialize the isElementaryGroup field
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public boolean isElementaryGroup() {
        return isElementaryGroup;
    }

    public void setElementaryGroup(boolean isElementaryGroup) {
        this.isElementaryGroup = isElementaryGroup;
    }
}
