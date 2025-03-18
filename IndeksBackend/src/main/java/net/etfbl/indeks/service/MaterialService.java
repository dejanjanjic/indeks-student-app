package net.etfbl.indeks.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import net.etfbl.indeks.dto.MaterialResponseDTO;
import net.etfbl.indeks.dto.MaterialSummaryDTO;
import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.Material;
import net.etfbl.indeks.repository.AccountRepository;
import net.etfbl.indeks.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaterialService {
    private final MaterialRepository materialRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository){
        this.materialRepository = materialRepository;
    }

    public List<Material> getMaterials() {
        return materialRepository.findAll();
    }
    public Optional<Material> getMaterialById(Long materialId) {
        return materialRepository.findById(materialId);
    }

    public List<MaterialSummaryDTO>  getMaterialByOwner(Long materialId) {
        List<Material> materials = materialRepository.findByownerAccountId(materialId);
        return materials.stream()
                .map(material -> new MaterialSummaryDTO(material.getId(), material.getName()))
                .collect(Collectors.toList());
    }

    public Material addNewMaterial(Material material) {
        return materialRepository.save(material);
    }

    public boolean deleteMaterial(Long materialId) {
        boolean exists = materialRepository.existsById(materialId);
        if(!exists){
            return false;
        }
        materialRepository.deleteById(materialId);
        return true;
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Material saveMaterial(Material material) {
        entityManager.persist(material);
        return material;
    }
    @Transactional
    public boolean updateMaterial(Material material) {
        Optional<Material> temp = materialRepository.findById(material.getId());
        if(temp.isEmpty()){
            return false;
        }
        Material updatedMaterial = temp.get();
        if(material.getContent() != null){
            updatedMaterial.setContent(material.getContent());
        }
        if(material.getName() != null){
            updatedMaterial.setName(material.getName());
        }
        materialRepository.save(updatedMaterial);
        return true;
    }

    public MaterialResponseDTO getMaterialAsDTO(Long materialId) {
        // Fetch the material from the database
        Optional<Material> materialOptional = materialRepository.findById(materialId);

        if (materialOptional.isEmpty()) {
            return null; // or throw a custom exception if you prefer
        }

        Material material = materialOptional.get();
        String filePath = material.getContent(); // Path from the 'content' column in database
        File file = new File(filePath);

        if (!file.exists()) {
            return null; // or handle file not found scenario
        }

        try {
            // Read file content and encode it to Base64
            byte[] fileBytes = new byte[(int) file.length()];
            try (FileInputStream fis = new FileInputStream(file)) {
                fis.read(fileBytes);
            }

            String base64Encoded = Base64.getEncoder().encodeToString(fileBytes);

            // Return a DTO with the name and Base64 content
            return new MaterialResponseDTO(material.getName(), base64Encoded);

        } catch (IOException e) {
            e.printStackTrace();
            return null; // Handle the error, return null or custom error response
        }
    }

    public List<MaterialSummaryDTO> getMaterialsBySubject(Long subjectId) {
        // Fetch materials by subjectId
        List<Material> materials = materialRepository.findBySubjectId(subjectId);

        // Convert to MaterialSummaryDTO list
        return materials.stream()
                .map(material -> new MaterialSummaryDTO(material.getId(), material.getName()))
                .collect(Collectors.toList());
    }
}
