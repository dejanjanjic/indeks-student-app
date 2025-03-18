package net.etfbl.indeks.controller;

import net.etfbl.indeks.model.AdminAccount;
import net.etfbl.indeks.service.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/v1/adminAccount")
public class AdminAccountController {
    private final AdminAccountService adminAccountService;

    @Autowired
    public AdminAccountController(AdminAccountService adminAccountService){
        this.adminAccountService = adminAccountService;
    }
    @GetMapping
    public ResponseEntity<List<AdminAccount>> getAdminAccounts(){
        return ResponseEntity.ok(adminAccountService.getAdminAccounts());
    }

    @GetMapping(path = "{adminAccountId}")
    public ResponseEntity<AdminAccount> getAdminAccountById(@PathVariable(name = "adminAccountId")Long adminAccountId){
        Optional<AdminAccount> adminAccount = adminAccountService.getAdminAccountById(adminAccountId);
        if(adminAccount.isPresent()){
            return ResponseEntity.ok(adminAccount.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

}
