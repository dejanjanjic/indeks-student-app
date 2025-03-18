package net.etfbl.indeks.controller;


import net.etfbl.indeks.model.AnnouncementAttachment;
import net.etfbl.indeks.service.AnnouncementAttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/attachments")
public class AnnouncementAttachmentController {
    private final AnnouncementAttachmentService announcementAttachmentService;

    @Autowired
    public AnnouncementAttachmentController(AnnouncementAttachmentService announcementAttachmentService) {
        this.announcementAttachmentService = announcementAttachmentService;
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementAttachment>> getAnnouncementAttachments() {
        return ResponseEntity.ok(announcementAttachmentService.getAnnouncementAttachments());
    }

    @GetMapping(path = "{attachmentId}")
    public ResponseEntity<AnnouncementAttachment> getAnnouncementAttachmentById(@PathVariable("attachmentId") int id) {
        Optional<AnnouncementAttachment> attachment = announcementAttachmentService.getAnnouncementAttachmentById(id);
        if (attachment.isPresent()) {
            return ResponseEntity.ok(attachment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<AnnouncementAttachment> registerNewAnnouncementAttachment(@RequestBody AnnouncementAttachment attachment) {
        AnnouncementAttachment temp = announcementAttachmentService.addNewAnnouncementAttachment(attachment);
        if (temp != null) {
            return ResponseEntity.ok(temp);
        } else {
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).build();
        }
    }

    @DeleteMapping(path = "{attachmentId}")
    public ResponseEntity<Void> deleteAnnouncementAttachment(@PathVariable("attachmentId") int id) {
        boolean deleted = announcementAttachmentService.deleteAnnouncementAttachment(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateAnnouncementAttachment(@RequestBody AnnouncementAttachment attachment) {
        boolean updated = announcementAttachmentService.updateAnnouncementAttachment(attachment);
        if (updated) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
