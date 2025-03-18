package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.model.ElementaryGroupChat;
import net.etfbl.indeks.model.ElementaryGroupChatMember;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Optional<ElementaryGroupChatMember> getElementaryGroupChatMember(Long id) {
        return elementaryGroupChatMemberRepository.findById(id);
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
