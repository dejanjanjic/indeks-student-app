package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import net.etfbl.indeks.model.Schedule;
import net.etfbl.indeks.model.ScheduleItem;
import net.etfbl.indeks.repository.ScheduleItemRepository;
import net.etfbl.indeks.repository.ScheduleRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    @Autowired
    private ScheduleItemRepository scheduleItemRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<Schedule> getSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getSchedule(Long id) {
        return scheduleRepository.findById(id);
    }

    public void addNewSchedule(Schedule schedule) {
        scheduleRepository.save(schedule);
    }

    public boolean deleteSchedule(Long id) {
        boolean exists = scheduleRepository.existsById(id);
        if (!exists) {
            return false;
        }
        scheduleRepository.deleteById(id);
        return true;
    }

    public List<ScheduleItem> getScheduleItemsByStudentAccountId(Long studentAccountId) {
        try {
            // Retrieve the scheduleId associated with the studentAccountId
            Long scheduleId = entityManager.createQuery(
                            "SELECT sa.schedule.id FROM StudentAccount sa WHERE sa.id = :studentAccountId", Long.class)
                    .setParameter("studentAccountId", studentAccountId)
                    .getSingleResult();

            // If no scheduleId is found, return an empty list
            if (scheduleId == null) {
                return new ArrayList<>();
            }

            // Fetch the schedule items using the retrieved scheduleId
            List<ScheduleItem> scheduleItems = entityManager.createQuery(
                            "SELECT si FROM ScheduleItem si WHERE si.schedule.id = :scheduleId", ScheduleItem.class)
                    .setParameter("scheduleId", scheduleId)
                    .getResultList();

            return scheduleItems;
        } catch (NoResultException e) {
            System.err.println("No schedule or items found for studentAccountId: " + studentAccountId);
            return new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }



    public void fetchAndUpdateScheduleByStudentAccountId(Long studentAccountId, Integer number) {
        try {
            String year = "";
            String group = "";

            // Map the `number` to the year and group
            if (number >= 1 && number <= 7) {
                year = "1";
                group = Integer.toString(number); // Number 1-7 corresponds directly to the group
            } else if (number >= 8 && number <= 12) {
                year = "2";
                group = Integer.toString(number); // Number 8-12 corresponds to year 2 and group number
            } else if (number >= 13 && number <= 17) {
                year = "3";
                group = Integer.toString(number); // Number 13-17 corresponds to year 3 and group number
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid number input. It should be between 1 and 17.");
            }

            // Construct the API URL
            String urlString = "https://efee.etf.unibl.org:8443/api/public/raspored/studijski-program/" + year + "/godina/" + group;
            HttpURLConnection connection = (HttpURLConnection) new URL(urlString).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            // Read the API response
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            JSONArray scheduleData = new JSONArray(response.toString());

            // Fetch `scheduleId` using `studentAccountId`
            Long scheduleId = entityManager.createQuery(
                            "SELECT sa.schedule.id FROM StudentAccount sa WHERE sa.id = :studentAccountId", Long.class)
                    .setParameter("studentAccountId", studentAccountId)
                    .getSingleResult();

            System.out.println(scheduleId);
            if (scheduleId == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No schedule associated with the given student account ID");
            }


            // Find the schedule and update its items
            Optional<Schedule> scheduleOptional = scheduleRepository.findById(scheduleId);
            if (scheduleOptional.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule with ID " + scheduleId + " not found");
            }

            Schedule schedule = scheduleOptional.get();

            // Delete existing schedule items for the given schedule
            scheduleItemRepository.deleteByScheduleId(scheduleId);

            // Parse and save new schedule items
            for (int i = 0; i < scheduleData.length(); i++) {
                JSONArray timeSlot = scheduleData.getJSONArray(i);

                if (timeSlot.isNull(0)) {
                    continue;
                }

                String time = timeSlot.getString(0);
                int day = 0;

                for (int j = 1; j < timeSlot.length(); j++) {
                    if (timeSlot.isNull(j)) {
                        day++;
                        continue;
                    }

                    String content = timeSlot.getString(j).trim().replace("<br />", "\n");

                    if (content.isEmpty()) {
                        day++;
                        continue;
                    }

                    ScheduleItem scheduleItem = new ScheduleItem();
                    scheduleItem.setTime(time);
                    scheduleItem.setDay(day);
                    scheduleItem.setContent(content.substring(0, Math.min(200, content.length()))); // Truncate to 200 characters
                    scheduleItem.setSchedule(schedule);

                    scheduleItemRepository.save(scheduleItem);
                    day++;
                }
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching and parsing the schedule", e);
        }
    }



//    @Transactional
//    public boolean updateSchedule(Long scheduleId, String content) {
//        Optional<Schedule> schedule = scheduleRepository.findById(scheduleId);
//        if (schedule.isEmpty()) {
//            return false;
//        }
//        schedule.get().setContent(content);
//        return true;
//    }
}
