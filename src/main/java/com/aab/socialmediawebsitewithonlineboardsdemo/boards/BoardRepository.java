package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import com.aab.socialmediawebsitewithonlineboardsdemo.users.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByOwner(User owner);
    List<Board> findByOwnerAndIsPrivateFalse(User owner);

    // Метод для получения публичных досок с загруженным owner
    @Query("SELECT b FROM Board b JOIN FETCH b.owner WHERE b.isPrivate = false ORDER BY b.createdAt DESC")
    List<Board> findPublicWithOwner();

    // Метод для получения доски по ID с загруженным owner и items
    @Query("SELECT b FROM Board b " +
            "LEFT JOIN FETCH b.owner " +
            "LEFT JOIN FETCH b.items " +
            "WHERE b.id = :id")
    Optional<Board> findByIdWithOwnerAndItems(@Param("id") Long id);

    @Query("SELECT b FROM Board b WHERE b.isPrivate = false AND b.owner.id IN ?1 ORDER BY b.createdAt DESC")
    List<Board> feedForFollowees(List<Long> followeeIds);
}