package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.SingleChatSummaryDTO;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PushNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final OkHttpClient client = new OkHttpClient();

    public void sendPushNotification(String pushToken, String title, String body, String type, SingleChatSummaryDTO chatSummary) throws IOException {
        // Ensure the pushToken starts with "ExponentPushToken"
        if (!pushToken.startsWith("ExponentPushToken")) {
            throw new IllegalArgumentException("Invalid Expo Push Token");
        }

        // Build the data payload
        String jsonPayload;
        if (chatSummary != null) {
            // Include chatSummary data if it's not null
            jsonPayload = String.format(
                    "{ \"to\": \"%s\", \"title\": \"%s\", \"body\": \"%s\", \"sound\": \"default\", \"data\": { " +
                            "\"type\": \"%s\", " +
                            "\"chatId\": \"%s\", " +
                            "\"chatName\": \"%s\", " +
                            "\"lastMessage\": \"%s\", " +
                            "\"sender\": \"%s\", " +
                            "\"isGroup\": %b, " +
                            "\"isElementaryGroup\": %b " +
                            "} }",
                    pushToken,
                    title,
                    body,
                    type,
                    chatSummary.getId(),
                    chatSummary.getName(),
                    chatSummary.getLastMessage(),
                    chatSummary.getSender(),
                    chatSummary.isGroup(),
                    chatSummary.isElementaryGroup()
            );
        } else {
            // Minimal payload for announcements
            jsonPayload = String.format(
                    "{ \"to\": \"%s\", \"title\": \"%s\", \"body\": \"%s\", \"sound\": \"default\", \"data\": { " +
                            "\"type\": \"%s\" " +
                            "} }",
                    pushToken,
                    title,
                    body,
                    type
            );
        }

        // Build the request
        RequestBody bodyContent = RequestBody.create(jsonPayload, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(EXPO_PUSH_URL)
                .post(bodyContent)
                .build();

        // Send the request and handle the response
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code: " + response);
            }
            System.out.println("Notification sent successfully: " + response.body().string());
        }
    }
}
