package net.etfbl.indeks.service;

import net.etfbl.indeks.dto.AddScheduleItemDTO;
import net.etfbl.indeks.model.Schedule;
import net.etfbl.indeks.model.ScheduleItem;
import net.etfbl.indeks.model.StudentAccount;
import net.etfbl.indeks.repository.ScheduleItemRepository;
import net.etfbl.indeks.repository.ScheduleRepository;
import net.etfbl.indeks.repository.StudentAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleItemService {
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    public final ScheduleItemRepository scheduleItemRepository;
    @Autowired
    private  final StudentAccountRepository studentAccountRepository;

    @Autowired
    public ScheduleItemService(ScheduleItemRepository scheduleItemRepository, StudentAccountRepository studentAccountRepository) {
        this.scheduleItemRepository = scheduleItemRepository;
        this.studentAccountRepository = studentAccountRepository;
    }

    public List<ScheduleItem> getScheduleItems() {
        return scheduleItemRepository.findAll();
    }

    public Optional<ScheduleItem> getScheduleItem(Long id) {
        return scheduleItemRepository.findById(id);
    }

    public boolean deleteScheduleItem(Long id) {
        boolean exists = scheduleItemRepository.existsById(id);
        if (!exists) {
            return false;
        }
        scheduleItemRepository.deleteById(id);
        return true;
    }

    public void addNewScheduleItemForStudent(AddScheduleItemDTO addScheduleItemDTO) {
        // Retrieve the schedule ID associated with the student ID
        Optional<StudentAccount> studentAccountOptional = studentAccountRepository.findById(addScheduleItemDTO.getStudentId());
        if (studentAccountOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Student account with ID " + addScheduleItemDTO.getStudentId() + " not found");
        }

        Long scheduleId = studentAccountOptional.get().getSchedule().getId();
        Optional<Schedule> scheduleOptional = scheduleRepository.findById(scheduleId);

        if (scheduleOptional.isPresent()) {
            Schedule schedule = scheduleOptional.get();
            ScheduleItem scheduleItem = new ScheduleItem();
            scheduleItem.setDay(addScheduleItemDTO.getDay());
            scheduleItem.setTime(addScheduleItemDTO.getTime());
            scheduleItem.setContent(addScheduleItemDTO.getContent());
            scheduleItem.setSchedule(schedule);

            scheduleItemRepository.save(scheduleItem);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Schedule for student ID " + addScheduleItemDTO.getStudentId() + " not found");
        }
    }


    @Transactional
    public boolean updateScheduleItem(Long scheduleItemId, AddScheduleItemDTO addScheduleItemDTO) {
        Optional<ScheduleItem> scheduleItemOptional = scheduleItemRepository.findById(scheduleItemId);
        if (scheduleItemOptional.isEmpty()) {
            return false;
        }

        ScheduleItem scheduleItem = scheduleItemOptional.get();

        // Retrieve the schedule ID associated with the provided student ID
        Optional<StudentAccount> studentAccountOptional = studentAccountRepository.findById(addScheduleItemDTO.getStudentId());
        if (studentAccountOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Student account with ID " + addScheduleItemDTO.getStudentId() + " not found");
        }

        Long scheduleId = studentAccountOptional.get().getSchedule().getId();
        Optional<Schedule> scheduleOptional = scheduleRepository.findById(scheduleId);
        if (scheduleOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Schedule for student ID " + addScheduleItemDTO.getStudentId() + " not found");
        }

        // Update the ScheduleItem
        scheduleItem.setDay(addScheduleItemDTO.getDay());
        scheduleItem.setTime(addScheduleItemDTO.getTime());
        scheduleItem.setSchedule(scheduleOptional.get()); // Set the updated schedule
        scheduleItem.setContent(addScheduleItemDTO.getContent());

        return true;
    }


}
