package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import org.springframework.data.jpa.repository.JpaRepository;


public interface BoardItemRepository extends JpaRepository<BoardItem, Long> { }
