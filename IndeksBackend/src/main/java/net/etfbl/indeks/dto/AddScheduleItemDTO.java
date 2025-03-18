package net.etfbl.indeks.dto;

public class AddScheduleItemDTO {

    private int day;
    private String time;
    private Long studentId; // Student ID instead of Schedule ID
    private String content;

    public AddScheduleItemDTO() {}

    public AddScheduleItemDTO(int day, String time, Long studentId, String content) {
        this.day = day;
        this.time = time;
        this.studentId = studentId;
        this.content = content;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
