package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddUserAccountDTO;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.TutorAccountRepository;
import net.etfbl.indeks.repository.TutoringOfferRepository;
import net.etfbl.indeks.security.enumeration.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TutorAccountService {
    private final TutorAccountRepository tutorAccountRepository;

    private final UserAccountService userAccountService;

    private final TutoringOfferRepository tutoringOfferRepository;

    @Autowired
    public TutorAccountService(TutorAccountRepository tutorAccountRepository, UserAccountService userAccountService, TutoringOfferRepository tutoringOfferRepository){
        this.tutorAccountRepository = tutorAccountRepository;
        this.userAccountService = userAccountService;
        this.tutoringOfferRepository = tutoringOfferRepository;
    }

    public List<TutorAccount> getTutorAccounts() {
        return tutorAccountRepository.findAll();
    }
    public Optional<TutorAccount> getTutorAccountById(Long tutorAccountId) {
        return tutorAccountRepository.findById(tutorAccountId);
    }
    public boolean deleteTutorAccount(Long tutorAccountId) {
        boolean exists = tutorAccountRepository.existsById(tutorAccountId);
        if(!exists){
            return false;
        }
        tutorAccountRepository.deleteById(tutorAccountId);
        return true;
    }
    @Transactional
    public TutorAccount addNewTutorAccount(AddUserAccountDTO tutorAccount) {
        UserAccount acc = userAccountService.addNewUserAccount(tutorAccount, Roles.TUTOR);
        return tutorAccountRepository.save(new TutorAccount(acc));
    }
}
