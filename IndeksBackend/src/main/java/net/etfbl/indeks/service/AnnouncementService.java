package net.etfbl.indeks.service;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import net.etfbl.indeks.model.Announcement;
import net.etfbl.indeks.model.AnnouncementAttachment;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.AnnouncementRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AnnouncementService
{
    private final AnnouncementRepository announcementRepository;
    @PersistenceContext
    private EntityManager entityManager;
    private static final String BASE_API_URL = "https://efee.etf.unibl.org:8443/api/public/oglasne-ploce/";


    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository){
        this.announcementRepository = announcementRepository;
    }


    @Transactional
    public void fetchAndSaveAnnouncements() {
        try {
            for (int i = 1; i <= 6; i++) {
                List<Announcement> announcements = fetchObjectsFromApi(i);
                for (Announcement announcement : announcements) {
                    Optional<Announcement> existingAnnouncement = announcementRepository.findById(announcement.getId());

                    if (existingAnnouncement.isEmpty()) {
                        entityManager.persist(announcement);

                        if (announcement.getAnnouncementAttachment() != null) {
                            for (AnnouncementAttachment attachment : announcement.getAnnouncementAttachment()) {
                                attachment.setAnnouncement(announcement);
                                entityManager.persist(attachment);
                            }
                        }

                        // Trigger push notifications
                        sendNotificationsForAnnouncement(announcement);
                    } else {
                       // System.out.println("Announcement with ID " + announcement.getId() + " already exists.");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Autowired
    private PushNotificationService pushNotificationService;

    @Transactional
    public void sendNotificationsForAnnouncement(Announcement announcement) {

        TypedQuery<UserAccount> query = entityManager.createQuery(
                "SELECT ua FROM UserAccount ua " +
                        "WHERE ua.id IN (SELECT v.studentAccount.id FROM StudentAnnouncementVisibility v " +
                        "WHERE " +
                        "(v.canSeeYear1 = true AND :year = 1) OR " +
                        "(v.canSeeYear2 = true AND :year = 2) OR " +
                        "(v.canSeeYear3 = true AND :year = 3) OR " +
                        "(v.canSeeYear4 = true AND :year = 4) OR " +
                        "(v.canSeeMaster = true AND :year = 5) OR " +
                        "(v.canSeeDoctorate = true AND :year = 6))",
                UserAccount.class);
        query.setParameter("year", announcement.getYear());

        List<UserAccount> users = query.getResultList();

        // Send push notifications
        for (UserAccount user : users) {
            if (user.getPushNotificationToken() != null ) {
                try {
                    pushNotificationService.sendPushNotification(
                            user.getPushNotificationToken(),
                            announcement.getTitle(),
                            announcement.getHeader() != null ? announcement.getHeader() : "Provjerite detalje u aplikaciji!",
                            "announcement",null
                    );

                    System.out.println("------------"+user.getPushNotificationToken()+"------------"+announcement.getTitle());
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("Failed to send notification to user: " + user.getId());
                }
            }
        }
    }


    public static List<Announcement> fetchObjectsFromApi(int announcementYear) throws Exception {
        List<Announcement> objects = new ArrayList<>();


        String apiUrl = BASE_API_URL + announcementYear;
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");


        if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();


            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONArray jsonArray = new JSONArray(response.toString());
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                int year = announcementYear;

                Announcement announcement = new Announcement(
                        jsonObject.getLong("id"),
                        jsonObject.getString("naslov"),
                        jsonObject.optString("uvod", null),
                        jsonObject.getString("sadrzaj"),
                        jsonObject.optString("potpis", null),
                        jsonObject.getString("vrijemeKreiranja"),
                        jsonObject.getString("vrijemeIsteka"),
                        year
                );

                if (jsonObject.has("oglasPrilozi")) {
                    JSONArray attachmentsArray = jsonObject.getJSONArray("oglasPrilozi");
                    List<AnnouncementAttachment> attachments = new ArrayList<>();
                    for (int j = 0; j < attachmentsArray.length(); j++) {
                        JSONObject attachmentObj = attachmentsArray.getJSONObject(j);
                        AnnouncementAttachment attachment = new AnnouncementAttachment(
                                attachmentObj.getInt("id"),
                                attachmentObj.getString("naziv"),
                                attachmentObj.optString("putanja", null),
                                attachmentObj.optString("ekstenzija", null),
                                announcement
                        );
                        attachments.add(attachment);
                    }
                    announcement.setAnnouncementAttachment(attachments);
                }

                objects.add(announcement);
            }
        } else {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        conn.disconnect();
        return objects;
    }

    public List<Announcement> getAnnouncementsByYear(int year) {
        return announcementRepository.findByYear(year);
    }

    @Scheduled(fixedRate = 5000)
    public void scheduledFetchAndSaveAnnouncements() {
        System.out.println("Fetching new data....");
        fetchAndSaveAnnouncements();
    }

//   public List<Announcement> getAnnoucements() {
//        return announcementRepository.findAll();
//    }

//    public Announcement addNewAnnoucement(Announcement announcement) {
//        Optional<Account> accountByEmail = accountRepository.findByEmail(account.getEmail());
//        if(accountByEmail.isEmpty()){
//            return accountRepository.save(account);
//        }
//        return null;
//    }

//    public boolean deleteAccount(Long accountId) {
//        boolean exists = accountRepository.existsById(accountId);
//        if(!exists){
//            return false;
//        }
//        accountRepository.deleteById(accountId);
//        return true;
//    }

}

