package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "board_canvases")
public class BoardCanvas {
    @Id
    private Long boardId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(columnDefinition = "TEXT")
    private String canvasData; // JSON данные Excalidraw

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    // Getters and setters
    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public String getCanvasData() {
        return canvasData;
    }

    public void setCanvasData(String canvasData) {
        this.canvasData = canvasData;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}