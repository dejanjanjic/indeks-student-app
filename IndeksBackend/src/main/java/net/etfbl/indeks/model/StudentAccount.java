package net.etfbl.indeks.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class StudentAccount {
    @Id
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE)
    @MapsId
    @JoinColumn(name="id")
    private UserAccount userAccount;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "scheduleId")
    private Schedule schedule;

    @OneToMany(mappedBy = "studentAccount" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Review> reviews;

    @OneToOne(mappedBy = "studentAccount", cascade = CascadeType.ALL)
    @JsonManagedReference
    private StudentAnnouncementVisibility studentAnnouncementVisibility;

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public StudentAccount(){

    }

    public StudentAccount(UserAccount userAccount){
        this.userAccount = userAccount;
        //this.id = userAccount.getAccountId();
    }
    public StudentAccount(UserAccount userAccount,Schedule sch){
        this.userAccount = userAccount;
        this.schedule=sch;
        //this.id = userAccount.getAccountId();
    }
    public UserAccount getUserAccount(){ return userAccount;}

    public void setUserAccount(UserAccount userAccount){
        this.userAccount = userAccount;
        //this.id = userAccount.getAccountId();
    }

    public Long getId(){ return id;}

    public StudentAnnouncementVisibility getStudentAnnouncementVisibility() {
        return studentAnnouncementVisibility;
    }

    public void setStudentAnnouncementVisibility(StudentAnnouncementVisibility studentAnnouncementVisibility) {
        this.studentAnnouncementVisibility = studentAnnouncementVisibility;
    }
}
