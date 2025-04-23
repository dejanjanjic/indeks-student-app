package net.etfbl.indeks.service;

import io.minio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
public class MinioService {

    private final MinioClient minioClient;
    private final String bucketName;

    @Autowired
    public MinioService(MinioClient minioClient, @Value("${minio.bucketName}") String bucketName) {
        this.minioClient = minioClient;
        this.bucketName = bucketName;

        try {

            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error initializing MinIO bucket: " + e.getMessage(), e);
        }
    }

    public String uploadFile(String fileName, byte[] content) {
        try {

            String objectName = UUID.randomUUID().toString() + "-" + fileName;


            try (ByteArrayInputStream bais = new ByteArrayInputStream(content)) {
                minioClient.putObject(PutObjectArgs.builder().bucket(bucketName).object(objectName).stream(bais, content.length, -1).contentType(getContentType(fileName)).build());
            }

            return objectName;
        } catch (Exception e) {
            throw new RuntimeException("Error uploading file to MinIO: " + e.getMessage(), e);
        }
    }

    public byte[] downloadFile(String objectName) {
        try {
            GetObjectResponse response = minioClient.getObject(GetObjectArgs.builder().bucket(bucketName).object(objectName).build());

            return response.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file from MinIO: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucketName).object(objectName).build());
        } catch (Exception e) {
            throw new RuntimeException("Error deleting file from MinIO: " + e.getMessage(), e);
        }
    }

    private String getContentType(String fileName) {
        // Simple method to determine content type based on file extension
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "pdf":
                return "application/pdf";
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls":
                return "application/vnd.ms-excel";
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "txt":
                return "text/plain";
            default:
                return "application/octet-stream";
        }
    }
}