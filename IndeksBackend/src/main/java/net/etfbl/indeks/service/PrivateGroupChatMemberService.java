package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddElementaryGroupChatMemberDTO;
import net.etfbl.indeks.dto.AddPrivateGroupChatMemberDTO;
import net.etfbl.indeks.model.*;
import net.etfbl.indeks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PrivateGroupChatMemberService {

    private final PrivateGroupChatMemberRepository privateGroupChatMemberRepository;
    private final PrivateGroupChatRepository privateGroupChatRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public PrivateGroupChatMemberService(PrivateGroupChatMemberRepository privateGroupChatMemberRepository, PrivateGroupChatRepository privateGroupChatRepository, UserAccountRepository studentAccountRepository) {
        this.privateGroupChatMemberRepository = privateGroupChatMemberRepository;
        this.userAccountRepository = studentAccountRepository;
        this.privateGroupChatRepository = privateGroupChatRepository;
    }

    public List<PrivateGroupChatMember> getPrivateGroupChatMembers() {
        return privateGroupChatMemberRepository.findAll();
    }

    public Optional<PrivateGroupChatMember> getPrivateGroupChatMember(Long id) {
        return privateGroupChatMemberRepository.findById(id);
    }

    public List<Long> getMembersByGroupChatId(Long privateGroupChatId) {
        List<PrivateGroupChatMember> members = privateGroupChatMemberRepository.findByPrivateGroupChat_Id(privateGroupChatId);

        List<Long> memberIds = new ArrayList<>();
        for (PrivateGroupChatMember member : members) {
            memberIds.add(member.getUserAccount().getAccount().getId());
        }

        return memberIds;
    }

    public boolean deletePrivateGroupChatMember(Long id) {
        boolean exists = privateGroupChatMemberRepository.existsById(id);
        if (!exists) {
            return false;
        }
        privateGroupChatMemberRepository.deleteById(id);
        return true;
    }

    public boolean addNewPrivateGroupChatMember(AddPrivateGroupChatMemberDTO addDTO) {
        Optional<PrivateGroupChat> groupChatOptional = privateGroupChatRepository.findById(addDTO.gePrivateGroupChatId());
        Optional<UserAccount> userAccountOptional = userAccountRepository.findById(addDTO.getStudentAccountId());

        if (groupChatOptional.isEmpty() || userAccountOptional.isEmpty()) {
            return false;
        }

        PrivateGroupChatMember newMember = new PrivateGroupChatMember();
        newMember.setPrivateGroupChat(groupChatOptional.get());
        newMember.setUserAccount(userAccountOptional.get());

        privateGroupChatMemberRepository.save(newMember);
        return true;
    }

}
