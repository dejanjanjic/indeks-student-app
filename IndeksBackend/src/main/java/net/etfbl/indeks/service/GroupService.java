package net.etfbl.indeks.service;

import net.etfbl.indeks.model.GroupChat;
import net.etfbl.indeks.repository.ElementaryGroupChatMemberRepository;
import net.etfbl.indeks.repository.GroupRepository;
import net.etfbl.indeks.repository.PrivateGroupChatMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService
{
    private final PrivateGroupChatMemberRepository privateGroupChatMemberRepository;
    private final ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository,
                        PrivateGroupChatMemberRepository privateGroupChatMemberRepository,
                        ElementaryGroupChatMemberRepository elementaryGroupChatMemberRepository) {
        this.groupRepository = groupRepository;
        this.privateGroupChatMemberRepository = privateGroupChatMemberRepository;
        this.elementaryGroupChatMemberRepository = elementaryGroupChatMemberRepository;
    }

    public List<GroupChat> getGroups() {
        return groupRepository.findAll();
    }
    public Optional<GroupChat> getGroup(Long groupId) {
        return groupRepository.findById(groupId);
    }
    public void addNewGrupa(GroupChat group) {
        groupRepository.save(group);
    }

    public boolean deleteGroup(Long groupId) {
        boolean exists = groupRepository.existsById(groupId);
        if(!exists){
            return false;
        }
        groupRepository.deleteById(groupId);
        return exists;
    }
    @Transactional
    public boolean updateGroup(Long groupId, String groupName) {
        Optional<GroupChat> group = groupRepository.findById(groupId);
        if(group.isEmpty())
        {
            return false;
        }
        group.get().setName(groupName);
        return true;
    }


    @Transactional
    public boolean removeUserFromGroup(Long groupId, Long userId) {
        boolean isInPrivateGroup = privateGroupChatMemberRepository.existsByPrivateGroupChat_IdAndUserAccount_Id(groupId, userId);
        if (isInPrivateGroup) {
            privateGroupChatMemberRepository.deleteByPrivateGroupChat_IdAndUserAccount_Id(groupId, userId);
            return true;
        }

        boolean isInElementaryGroup = elementaryGroupChatMemberRepository.existsByElementaryGroupChat_IdAndStudentAccount_Id(groupId, userId);
        if (isInElementaryGroup) {
            elementaryGroupChatMemberRepository.deleteByElementaryGroupChat_IdAndStudentAccount_Id(groupId, userId);
            return true;
        }

        return false;
    }
}
