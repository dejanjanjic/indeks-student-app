package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.dto.UserAccountDetailsDTO;
import net.etfbl.indeks.dto.UserAccountSummaryDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.ElementaryGroupChatMember;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ElementaryGroupChatMemberService {

    private final ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository;
    private final ElementaryGroupChatRepository elementaryGroupChatRepository;
    private final StudentAccountRepository studentAccountRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public ElementaryGroupChatMemberService(ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository, ElementaryGroupChatRepository elementaryGroupChatRepository, StudentAccountRepository studentAccountRepository, UserAccountRepository userAccountRepository) {
        this.elementaryGroupChatMemberRepository = elementaryGroupChatMemberRepository;
        this.studentAccountRepository = studentAccountRepository;
        this.elementaryGroupChatRepository = elementaryGroupChatRepository;
        this.userAccountRepository = userAccountRepository;
    }

    public List<ElementaryGroupChatMember> getElementaryGroupChatMembers() {
        return elementaryGroupChatMemberRepository.findAll();
    }
    public Integer getElementaryGroupChatSize(Long id) {
        return elementaryGroupChatMemberRepository.findByElementaryGroupChat_Id(id).size();
    }

    public Optional<ElementaryGroupChatMember> getElementaryGroupChatMember(Long memberId) {
        return elementaryGroupChatMemberRepository.findById(memberId);
    }
    public Optional<ElementaryGroupChat> getElementaryGroupChat(Long elementaryGroupChatId) {
        return elementaryGroupChatRepository.findById(elementaryGroupChatId);
    }

    public boolean isStudentElementaryGroupChatMember(Long accountId, Long elementaryGroupChatId) {
        return elementaryGroupChatMemberRepository.existsByElementaryGroupChat_IdAndStudentAccount_Id(elementaryGroupChatId, accountId);
    }


    public boolean addNewElementaryGroupChatMember(AddElementaryGroupChatMemberDTO addDTO) {
        Optional<ElementaryGroupChat> groupChatOptional = elementaryGroupChatRepository.findById(addDTO.getElementaryGroupChatId());
        Optional<StudentAccount> studentAccountOptional = studentAccountRepository.findById(addDTO.getStudentAccountId());

        if (groupChatOptional.isEmpty() || studentAccountOptional.isEmpty()) {
            return false;
        }

        ElementaryGroupChatMember newMember = new ElementaryGroupChatMember();
        newMember.setElementaryGroupChat(groupChatOptional.get());
        newMember.setStudentAccount(studentAccountOptional.get());

        elementaryGroupChatMemberRepository.save(newMember);
        return true;
    }

    public List<UserAccountDetailsDTO> getElementaryGroupChatMembersByGroupId(Long groupId) {
        List<UserAccountDetailsDTO> users = new ArrayList<>();
        List<Long> userAccountIds = elementaryGroupChatMemberRepository
                .findByElementaryGroupChat_Id(groupId)
                .stream()
                .map(egcm -> egcm.getStudentAccount().getId())
                .toList();
        for(Long id : userAccountIds){
            users.add(userAccountRepository.findAllUserAccountDetailsById(id).orElseThrow());
        }
        return users;
    }

    public List<UserAccountDetailsDTO> filterElementaryGroupChatMembersByGroupId(Long groupId, String keyword) {
        List<UserAccountDetailsDTO> users = new ArrayList<>();
        List<Long> userAccountIds = elementaryGroupChatMemberRepository
                .findByElementaryGroupChat_Id(groupId)
                .stream()
                .map(egcm -> egcm.getStudentAccount().getId())
                .toList();
        UserAccountDetailsDTO user = null;
        String key = keyword.toLowerCase();
        for(Long id : userAccountIds){
            user = userAccountRepository.findAllUserAccountDetailsById(id).orElse(null);
            if(user != null && (user.getFirstName().toLowerCase().contains(key) || user.getLastName().toLowerCase().contains(key) || user.getEmail().toLowerCase().contains(key))){
                users.add(user);
            }
        }
        return users;
    }

    public boolean delete(Long groupId, Long userAccountId) {
        if(elementaryGroupChatMemberRepository.existsByElementaryGroupChat_IdAndStudentAccount_Id(groupId, userAccountId)){
            elementaryGroupChatMemberRepository.deleteByElementaryGroupChat_IdAndStudentAccount_Id(groupId, userAccountId);
            return true;
        }
        return false;
    }


}