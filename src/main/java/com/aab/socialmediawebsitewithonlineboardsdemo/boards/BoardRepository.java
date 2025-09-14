package com.aab.socialmediawebsitewithonlineboardsdemo.boards;


import com.aab.socialmediawebsitewithonlineboardsdemo.users.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByOwner(User owner);
    List<Board> findByOwnerAndIsPrivateFalse(User owner);
    List<Board> findByIsPrivateFalseOrderByCreatedAtDesc();


    @Query("select b from Board b where b.isPrivate = false and b.owner.id in ?1 order by b.createdAt desc")
    List<Board> feedForFollowees(List<Long> followeeIds);
}