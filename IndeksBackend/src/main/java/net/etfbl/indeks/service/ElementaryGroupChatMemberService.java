package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.ElementaryGroupChatMember;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElementaryGroupChatMemberService {

    private final ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository;
    private final ElementaryGroupChatRepository elementaryGroupChatRepository;
    private final StudentAccountRepository studentAccountRepository;

    @Autowired
    public ElementaryGroupChatMemberService(ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository, ElementaryGroupChatRepository elementaryGroupChatRepository, StudentAccountRepository studentAccountRepository) {
        this.elementaryGroupChatMemberRepository = elementaryGroupChatMemberRepository;
        this.studentAccountRepository = studentAccountRepository;
        this.elementaryGroupChatRepository = elementaryGroupChatRepository;
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

}