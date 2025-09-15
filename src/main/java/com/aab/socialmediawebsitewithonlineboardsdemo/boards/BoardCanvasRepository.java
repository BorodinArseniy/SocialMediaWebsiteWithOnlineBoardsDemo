package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BoardCanvasRepository extends JpaRepository<BoardCanvas, Long> {
    Optional<BoardCanvas> findByBoardId(Long boardId);
}