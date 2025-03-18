package net.etfbl.indeks.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table
public class ScheduleItem {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    private int day;
    private String time;
    @ManyToOne(optional = false)
    @JoinColumn(name = "scheduleId")
    @JsonBackReference
    private Schedule schedule;

    private String content;

    public ScheduleItem() {}

    public ScheduleItem( int day, String time,Schedule schedule, String content)
    {
        this.day = day;
        this.time = time;
        this.schedule = schedule;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setTime(String time) { this.time = time;}

    public void setSchedule(Schedule schedule) {this.schedule = schedule;}

    public Schedule getSchedule() {return schedule;}

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
