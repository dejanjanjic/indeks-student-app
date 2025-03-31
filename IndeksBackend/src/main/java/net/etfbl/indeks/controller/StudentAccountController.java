package net.etfbl.indeks.controller;

import net.etfbl.indeks.dto.AddUserAccountDTO;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.service.StudentAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/studentAccount")
public class StudentAccountController {

    private final StudentAccountService studentAccountService;

    @Autowired
    public StudentAccountController(StudentAccountService studentAccountService) {
        this.studentAccountService = studentAccountService;
    }

    @GetMapping
    public ResponseEntity<List<StudentAccount>> getAccounts() {
        return ResponseEntity.ok(studentAccountService.getStudentAccounts());
    }

    @GetMapping(path = "{accountId}")
    public ResponseEntity<StudentAccount> getStudentAccountById(@PathVariable(name = "accountId") Long accountId) {
        Optional<StudentAccount> studentAccount = studentAccountService.getStudentAccountById(accountId);
        if (studentAccount.isPresent()) {
            return ResponseEntity.ok(studentAccount.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<StudentAccount> registerNewStudentAccount(@RequestBody AddUserAccountDTO addUserAccountDTO) {
        StudentAccount newAccount = studentAccountService.addNewStudentAccount(addUserAccountDTO);
        if (newAccount != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    @DeleteMapping(path = "{accountId}")
    public ResponseEntity<Void> deleteStudentAccount(@PathVariable("accountId") Long accountId) {
        boolean deleted = studentAccountService.deleteStudentAccount(accountId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
