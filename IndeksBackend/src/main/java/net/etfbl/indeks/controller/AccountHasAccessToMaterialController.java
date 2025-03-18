package net.etfbl.indeks.controller;

import net.etfbl.indeks.model.Account;
import net.etfbl.indeks.model.AccountHasAccessToMaterial;
import net.etfbl.indeks.service.AccountHasAccessToMaterialService;
import net.etfbl.indeks.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/accountHasAccessToMaterial")
public class AccountHasAccessToMaterialController {
    private final AccountHasAccessToMaterialService accountHasAccessToMaterialService;

    @Autowired
    public AccountHasAccessToMaterialController(AccountHasAccessToMaterialService accountHasAccessToMaterialService){
        this.accountHasAccessToMaterialService = accountHasAccessToMaterialService;
    }

    @GetMapping
    public ResponseEntity<List<AccountHasAccessToMaterial>> getAccountHasAccessToMaterials(){
        return ResponseEntity.ok(accountHasAccessToMaterialService.getAccountHasAccessToMaterials());
    }

    @GetMapping(path = "{accountHasAccessToMaterialId}")
    public ResponseEntity<AccountHasAccessToMaterial> getAccountHasAccessToMaterialById(@PathVariable(name = "accountHasAccessToMaterialId")Long accountHasAccessToMaterialId){
        Optional<AccountHasAccessToMaterial> accountHasAccessToMaterial = accountHasAccessToMaterialService.getAccountHasAccessToMaterialById(accountHasAccessToMaterialId);
        if(accountHasAccessToMaterial.isPresent()){
            return ResponseEntity.ok(accountHasAccessToMaterial.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<AccountHasAccessToMaterial> postNewAccountHasAccessToMaterial(@RequestBody AccountHasAccessToMaterial accountHasAccessToMaterial){
        AccountHasAccessToMaterial temp = accountHasAccessToMaterialService.addNewAccountHasAccessToMaterial(accountHasAccessToMaterial);
        if(temp != null){
            return ResponseEntity.ok(temp);
        }else{
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).build();
        }
    }

    @DeleteMapping(path = "{accountHasAccessToMaterialId}")
    public ResponseEntity<Void> deleteAccountHasAccessToMaterial(@PathVariable("accountHasAccessToMaterialId")Long accountHasAccessToMaterial){
        boolean deleted = accountHasAccessToMaterialService.deleteAccountHasAccessToMaterial(accountHasAccessToMaterial);
        if(deleted){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
