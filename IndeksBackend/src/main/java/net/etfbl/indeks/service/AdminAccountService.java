package net.etfbl.indeks.service;

import net.etfbl.indeks.model.AdminAccount;
import net.etfbl.indeks.repository.AccountRepository;
import net.etfbl.indeks.repository.AdminAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminAccountService {
    private final AdminAccountRepository adminAccountRepository;

    private final AccountRepository accountRepository;

    @Autowired
    public AdminAccountService(AdminAccountRepository adminAccountRepository, AccountRepository accountRepository){
        this.adminAccountRepository = adminAccountRepository;
        this.accountRepository = accountRepository;
    }
    public List<AdminAccount> getAdminAccounts(){
        return adminAccountRepository.findAll();
    }

    public Optional<AdminAccount> getAdminAccountById(Long id){
        return adminAccountRepository.findById(id);
    }
}
