package net.etfbl.indeks.controller;

import net.etfbl.indeks.model.Announcement;
import net.etfbl.indeks.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }
    @PostMapping("/fetch")
    public String fetchAnnouncements() {
        announcementService.fetchAndSaveAnnouncements();
        return "Announcements fetched and saved successfully!";
    }

    @GetMapping("/year/{year}")
    public List<Announcement> getAnnouncementsByYear(@PathVariable int year) {
        return announcementService.getAnnouncementsByYear(year)
                .stream()
                .sorted(Comparator.comparing(Announcement::getId).reversed())
                .toList();
    }


}
