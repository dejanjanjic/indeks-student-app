package net.etfbl.indeks.service;

import net.etfbl.indeks.model.AccountHasAccessToMaterial;
import net.etfbl.indeks.model.Material;
import net.etfbl.indeks.repository.AccountHasAccessToMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AccountHasAccessToMaterialService {
    private final AccountHasAccessToMaterialRepository accountHasAccessToMaterialRepository;

    @Autowired
    public AccountHasAccessToMaterialService(AccountHasAccessToMaterialRepository accountHasAccessToMaterialRepository){
        this.accountHasAccessToMaterialRepository = accountHasAccessToMaterialRepository;
    }

    public List<AccountHasAccessToMaterial> getAccountHasAccessToMaterials() {
        return accountHasAccessToMaterialRepository.findAll();
    }
    public Optional<AccountHasAccessToMaterial> getAccountHasAccessToMaterialById(Long accountHasAccessToMaterialId) {
        return accountHasAccessToMaterialRepository.findById(accountHasAccessToMaterialId);
    }

    public AccountHasAccessToMaterial addNewAccountHasAccessToMaterial(AccountHasAccessToMaterial accountHasAccessToMaterial) {
        return accountHasAccessToMaterialRepository.save(accountHasAccessToMaterial);
    }

    public boolean deleteAccountHasAccessToMaterial(Long accountHasAccessToMaterialId) {
        boolean exists = accountHasAccessToMaterialRepository.existsById(accountHasAccessToMaterialId);
        if(!exists){
            return false;
        }
        accountHasAccessToMaterialRepository.deleteById(accountHasAccessToMaterialId);
        return true;
    }
}
