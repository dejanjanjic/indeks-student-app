package net.etfbl.indeks.service;

import jakarta.persistence.EntityNotFoundException;
import net.etfbl.indeks.dto.ProblemReportDTO;
import net.etfbl.indeks.dto.ProblemReportDetailsDTO;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProblemReportService {
    private final ProblemReportRepository problemReportRepository;
    private final ReviewRepository reviewRepository;
    private final MaterialRepository materialRepository;
    private final UserAccountRepository userAccountRepository;

    private final SingleChatRepository singleChatRepository;

    public ProblemReportService(ProblemReportRepository problemReportRepository,
                                ReviewRepository reviewRepository,
                                MaterialRepository materialRepository,
                                UserAccountRepository userAccountRepository, SingleChatRepository singleChatRepository) {
        this.problemReportRepository = problemReportRepository;
        this.reviewRepository = reviewRepository;
        this.materialRepository = materialRepository;
        this.userAccountRepository = userAccountRepository;
        this.singleChatRepository = singleChatRepository;
    }

    public ProblemReportDTO saveReport(ProblemReportDTO dto) {
        ProblemReport report = new ProblemReport();
        report.setReason(dto.getReason());
        report.setTime(LocalDateTime.now());
        report.setType(dto.getType());

        Optional<Review> review = reviewRepository.findById(dto.getReviewId());
        review.ifPresent(report::setReview);

        Optional<Material> material = materialRepository.findById(dto.getMaterialId());
        material.ifPresent(report::setMaterial);

        Optional<UserAccount> reporter = userAccountRepository.findById(dto.getReporterId());
        reporter.ifPresent(report::setReporter);


        Optional<SingleChat> singleChat = singleChatRepository.findById(dto.getReportedId());

        Optional<UserAccount> currentUser = userAccountRepository.findById(dto.getReporterId());

        UserAccount otherUser = null;
        if(singleChat.isPresent())
        {
             otherUser = singleChat.get().getOtherUser(currentUser.get());
        }

        if(otherUser!=null)
        {

            Optional<UserAccount> reported = userAccountRepository.findById(otherUser.getId());
            reported.ifPresent(report::setReported);

        }

        ProblemReport saved = problemReportRepository.save(report);
        return mapToDTO(saved);
    }



    private ProblemReportDTO mapToDTO(ProblemReport report) {
        ProblemReportDTO dto = new ProblemReportDTO();
        dto.setId(report.getId());
        dto.setReason(report.getReason());
        dto.setTime(report.getTime());
        dto.setType(report.getType());
        dto.setReviewId(report.getReview() != null ? report.getReview().getId() : null);
        dto.setMaterialId(report.getMaterial() != null ? report.getMaterial().getId() : null);

        dto.setReporterId(report.getReporter() != null ? report.getReporter().getId() : null);


        dto.setReportedId(report.getReported() != null ? report.getReported().getId() : null);


        return dto;
    }

    public List<ProblemReport> getProblemReports() {
        return problemReportRepository.findAll();
    }

    public Optional<ProblemReport> getProblemReportById(Long id) {
        return problemReportRepository.findById(id);
    }

    public void addNewProblemReport(ProblemReport problemReport) {
        problemReportRepository.save(problemReport);
    }

    public boolean deleteProblemReport(Long id) {
        boolean exists = problemReportRepository.existsById(id);
        if (exists) {
            problemReportRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<ProblemReportDetailsDTO> getReportsByType(Integer type) {
        return problemReportRepository.findByType(type)
                .stream()
                .map(this::mapToDetailsDTO)
                .collect(Collectors.toList());
    }

    // Mapper method to convert ProblemReport to ProblemReportDetailsDTO
    private ProblemReportDetailsDTO mapToDetailsDTO(ProblemReport report) {
        ProblemReportDetailsDTO dto = new ProblemReportDetailsDTO();
        dto.setId(report.getId());
        dto.setReason(report.getReason());
        dto.setTime(report.getTime());
        dto.setType(report.getType());

        if (report.getReporter() != null) {
            dto.setReporterName(report.getReporter().getFirstName());
            dto.setReporterSurname(report.getReporter().getLastName());
        }

        if (report.getMaterial() != null) {
            String replace = "";
            replace = report.getMaterial().getName();
            if(replace.length()>=25)
            {
                replace = replace.substring(0,21);
                replace = replace + "...";
            }
            dto.setMaterialName(replace);
            dto.setMaterialId(report.getMaterial().getId()); // Add the ID of the Material
        }

        if (report.getReported() != null) {
            dto.setReportedName(report.getReported().getFirstName());
            dto.setReportedSurname(report.getReported().getLastName());
            dto.setReportedId(report.getReported().getId()); // Add the ID of the Reported User
        }

        if (report.getReview() != null) {

            String replace = "";
            replace = report.getReview().getComment();
            if(replace.length()>=25)
            {
                replace = replace.substring(0,21);
                replace = replace + "...";
            }
            dto.setReviewText(replace);
            dto.setReviewId(report.getReview().getId()); // Add the ID of the Review
        }

        return dto;
    }

}
