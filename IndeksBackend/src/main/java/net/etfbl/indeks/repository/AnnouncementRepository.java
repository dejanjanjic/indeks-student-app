package net.etfbl.indeks.repository;


import net.etfbl.indeks.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long>
{
    List<Announcement> findByYear(int year);
}
