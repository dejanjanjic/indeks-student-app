package net.etfbl.indeks.service;


import net.etfbl.indeks.model.AnnouncementAttachment;
import net.etfbl.indeks.repository.AnnouncementAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementAttachmentService {
    private final AnnouncementAttachmentRepository announcementAttachmentRepository;

    @Autowired
    public AnnouncementAttachmentService(AnnouncementAttachmentRepository announcementAttachmentRepository){
        this.announcementAttachmentRepository = announcementAttachmentRepository;
    }


    public List<AnnouncementAttachment> getAnnouncementAttachments() {
        return announcementAttachmentRepository.findAll();
    }

    public Optional<AnnouncementAttachment> getAnnouncementAttachmentById(int id) {
        return announcementAttachmentRepository.findById(id);
    }


    public AnnouncementAttachment addNewAnnouncementAttachment(AnnouncementAttachment attachment) {
        return announcementAttachmentRepository.save(attachment);
    }

    public boolean deleteAnnouncementAttachment(int id) {
        boolean exists = announcementAttachmentRepository.existsById(id);
        if (!exists) {
            return false;
        }
        announcementAttachmentRepository.deleteById(id);
        return true;
    }

    @Transactional
    public boolean updateAnnouncementAttachment(AnnouncementAttachment attachment) {
        Optional<AnnouncementAttachment> temp = announcementAttachmentRepository.findById(attachment.getId());
        if (temp.isEmpty()) {
            return false;
        }

        AnnouncementAttachment updatedAttachment = temp.get();
        if (attachment.getName() != null) {
            updatedAttachment.setName(attachment.getName());
        }
        if (attachment.getPathName() != null) {
            updatedAttachment.setPathName(attachment.getPathName());
        }
        if (attachment.getExtension() != null) {
            updatedAttachment.setExtension(attachment.getExtension());
        }

        announcementAttachmentRepository.save(updatedAttachment);
        return true;
    }
}

