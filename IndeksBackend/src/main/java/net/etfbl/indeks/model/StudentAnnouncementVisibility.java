package net.etfbl.indeks.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;


@Entity
@Table
public class StudentAnnouncementVisibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "studentAccountId", unique = true, nullable = false)
    @JsonBackReference
    private StudentAccount studentAccount;

    private boolean canSeeYear1;
    private boolean canSeeYear2;
    private boolean canSeeYear3;
    private boolean canSeeYear4;
    private boolean canSeeMaster;
    private boolean canSeeDoctorate;


    public StudentAnnouncementVisibility(){}

    public StudentAnnouncementVisibility(StudentAccount studentAccount,boolean canSeeYear1,boolean canSeeYear2,boolean canSeeYear3,boolean canSeeYear4,boolean canSeeMaster,boolean canSeeDoctorate)
    {
        this.studentAccount = studentAccount;
        this.canSeeYear1 = canSeeYear1;
        this.canSeeYear2 = canSeeYear2;
        this.canSeeYear3 = canSeeYear3;
        this.canSeeYear4 = canSeeYear4;
        this.canSeeMaster = canSeeMaster;
        this.canSeeDoctorate = canSeeDoctorate;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentAccount getStudentAccount() {
        return studentAccount;
    }

    public void setStudentAccount(StudentAccount studentAccount) {
        this.studentAccount = studentAccount;
    }

    public boolean isCanSeeYear1() {
        return canSeeYear1;
    }

    public void setCanSeeYear1(boolean canSeeYear1) {
        this.canSeeYear1 = canSeeYear1;
    }

    public boolean isCanSeeYear2() {
        return canSeeYear2;
    }

    public void setCanSeeYear2(boolean canSeeYear2) {
        this.canSeeYear2 = canSeeYear2;
    }

    public boolean isCanSeeYear3() {
        return canSeeYear3;
    }

    public void setCanSeeYear3(boolean canSeeYear3) {
        this.canSeeYear3 = canSeeYear3;
    }

    public boolean isCanSeeYear4() {
        return canSeeYear4;
    }

    public void setCanSeeYear4(boolean canSeeYear4) {
        this.canSeeYear4 = canSeeYear4;
    }

    public boolean isCanSeeMaster() {
        return canSeeMaster;
    }

    public void setCanSeeMaster(boolean canSeeMaster) {
        this.canSeeMaster = canSeeMaster;
    }

    public boolean isCanSeeDoctorate() {
        return canSeeDoctorate;
    }

    public void setCanSeeDoctorate(boolean canSeeDoctorate) {
        this.canSeeDoctorate = canSeeDoctorate;
    }
}
