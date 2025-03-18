package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddUserAccountDTO;
import net.etfbl.indeks.model.Schedule;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.model.UserAccount;
import net.etfbl.indeks.repository.ScheduleRepository;
import net.etfbl.indeks.repository.StudentAccountRepository;
import net.etfbl.indeks.security.enumeration.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StudentAccountService {

    private final StudentAccountRepository studentAccountRepository;
    private final UserAccountService userAccountService;
    private final ScheduleRepository scheduleRepository;


    @Autowired
    public StudentAccountService(StudentAccountRepository studentAccountRepository,UserAccountService userAccountService,ScheduleRepository scheduleRepository){
        this.studentAccountRepository = studentAccountRepository;
        this.userAccountService = userAccountService;
        this.scheduleRepository = scheduleRepository;
    }
    public List<StudentAccount> getStudentAccounts() {
        return studentAccountRepository.findAll();
    }

    public Optional<StudentAccount> getStudentAccountById(Long studentAccountId) {
        return studentAccountRepository.findById(studentAccountId);
    }
    @Transactional
    public StudentAccount addNewStudentAccount(AddUserAccountDTO  studentAccount) {
        UserAccount acc = userAccountService.addNewUserAccount(studentAccount, Roles.STUDENT);
        Schedule sch = scheduleRepository.save(new Schedule(""));
        return studentAccountRepository.save(new StudentAccount(acc,sch));
    }
    public boolean deleteStudentAccount(Long studentAccountId) {
        boolean exists = studentAccountRepository.existsById(studentAccountId);
        if(!exists){
            return false;
        }
        studentAccountRepository.deleteById(studentAccountId);
        return true;
    }
}
