package net.etfbl.indeks.controller;

        import jakarta.persistence.EntityManager;
        import jakarta.persistence.PersistenceContext;
        import net.etfbl.indeks.dto.MaterialDTO;
        import net.etfbl.indeks.dto.MaterialWebDTO;
        import net.etfbl.indeks.dto.MaterialResponseDTO;
        import net.etfbl.indeks.dto.MaterialSummaryDTO;
        import net.etfbl.indeks.model.Material;
        import net.etfbl.indeks.model.Subject;
        import net.etfbl.indeks.model.UserAccount;
        import net.etfbl.indeks.service.MaterialService;
        import net.etfbl.indeks.service.MinioService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.HttpStatusCode;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.Base64;
        import java.util.List;
        import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/material")
public class MaterialController {
    private final MaterialService materialService;
    private final MinioService minioService;

    @Autowired
    public MaterialController(MaterialService materialService, MinioService minioService) {
        this.materialService = materialService;
        this.minioService = minioService;
    }

    @GetMapping
    public ResponseEntity<List<Material>> getMaterials() {
        return ResponseEntity.ok(materialService.getMaterials());
    }
    @GetMapping("/DTOs")
    public ResponseEntity<List<MaterialWebDTO>> getMaterialDTOs() {
        return ResponseEntity.ok(materialService.getMaterialDTOs());
    }

    @GetMapping(path = "{materialId}")
    public ResponseEntity<Material> getMaterialById(@PathVariable(name = "materialId") Long materialId) {
        Optional<Material> material = materialService.getMaterialById(materialId);
        if (material.isPresent()) {
            return ResponseEntity.ok(material.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Material> postMaterial(@RequestBody Material material) {
        Material temp = materialService.addNewMaterial(material);
        if (temp != null) {
            return ResponseEntity.ok(temp);
        } else {
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).build();
        }
    }

    @DeleteMapping(path = "{materialId}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable("materialId") Long materialId) {
        // Get material to retrieve MinIO object name before deletion
        Optional<Material> material = materialService.getMaterialById(materialId);
        if (material.isPresent()) {
            String objectName = material.get().getContent();

            // Delete from database
            boolean deleted = materialService.deleteMaterial(materialId);

            if (deleted) {
                // Delete from MinIO
                try {
                    minioService.deleteFile(objectName);
                } catch (Exception e) {
                    // Log the error but continue, as the database record is already deleted
                    System.err.println("Error deleting file from MinIO: " + e.getMessage());
                }
                return ResponseEntity.noContent().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<Void> updateMaterial(@RequestBody Material material) {
        boolean updated = materialService.updateMaterial(material);
        if (updated) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PersistenceContext
    private EntityManager entityManager;
//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadMaterial(@RequestBody MaterialDTO materialDTO) {
//        try {
//            byte[] fileBytes = Base64.getDecoder().decode(materialDTO.getBase64());
//
//            // Define the storage directory
//            String storagePath = "C:\\MATERIJALI";
//            File directory = new File(storagePath);
//            if (!directory.exists()) {
//                directory.mkdirs();
//            }
//
//            // Extract the file extension and generate the file path
//            String fileName = materialDTO.getName();
//            int extensionIndex = fileName.lastIndexOf(".");
//            String extension = extensionIndex != -1 ? fileName.substring(extensionIndex) : "";
//            String baseName = extensionIndex != -1 ? fileName.substring(0, extensionIndex) : fileName;
//            String filePath = storagePath + "\\" + baseName + extension;
//
//            // Save the file to disk
//            try (FileOutputStream fos = new FileOutputStream(filePath)) {
//                fos.write(fileBytes);
//            }
//
//            // Fetch Subject and OwnerAccount
//            Subject subject = entityManager.find(Subject.class, materialDTO.getSubjectId());
//            UserAccount ownerAccount = entityManager.find(UserAccount.class, materialDTO.getOwnerAccountId());
//            if (subject == null || ownerAccount == null) {
//                return ResponseEntity.status(404).body("Subject or Owner Account not found.");
//            }
//
//            // Create and populate the Material entity
//            Material material = new Material();
//            material.setName(fileName);
//            material.setContent(filePath);
//            material.setSubject(subject);
//            material.setOwnerAccount(ownerAccount);
//
//            // Save the Material using the service
//            Material savedMaterial = materialService.saveMaterial(material);
//
//            return ResponseEntity.ok(savedMaterial);
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error while saving file: " + e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(400).body("Invalid request: " + e.getMessage());
//        }
//    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadMaterial(@RequestBody MaterialDTO materialDTO) {
        try {

            byte[] fileBytes = Base64.getDecoder().decode(materialDTO.getBase64());


            String fileName = materialDTO.getName();


            String objectName = minioService.uploadFile(fileName, fileBytes);


            Subject subject = entityManager.find(Subject.class, materialDTO.getSubjectId());
            UserAccount ownerAccount = entityManager.find(UserAccount.class, materialDTO.getOwnerAccountId());
            if (subject == null || ownerAccount == null) {
                return ResponseEntity.status(404).body("Subject or Owner Account not found.");
            }


            Material material = new Material();
            material.setName(fileName);
            material.setContent(objectName);
            material.setSubject(subject);
            material.setOwnerAccount(ownerAccount);


            Material savedMaterial = materialService.saveMaterial(material);

            return ResponseEntity.ok(savedMaterial);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error while processing file: " + e.getMessage());
        }
    }

    @GetMapping("/material/{materialId}")
    public ResponseEntity<?> getMaterial(@PathVariable Long materialId) {

        MaterialResponseDTO materialResponseDTO = materialService.getMaterialAsDTO(materialId);

        if (materialResponseDTO == null) {
            return ResponseEntity.status(404).body("Material not found or error fetching content.");
        }

        return ResponseEntity.ok(materialResponseDTO);
    }

    @GetMapping("/materials/subject/{subjectId}")
    public List<MaterialSummaryDTO> getMaterialsBySubject(@PathVariable Long subjectId) {
        return materialService.getMaterialsBySubject(subjectId);
    }

    @GetMapping(path = "owner/{ownerId}")
    public ResponseEntity<List<MaterialSummaryDTO>> getMaterialByOwnerId(@PathVariable(name = "ownerId") Long ownerId) {
        List<MaterialSummaryDTO> materials = materialService.getMaterialByOwner(ownerId);
        return ResponseEntity.ok(materials);
    }
}