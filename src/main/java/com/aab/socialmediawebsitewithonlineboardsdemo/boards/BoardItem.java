package com.aab.socialmediawebsitewithonlineboardsdemo.boards;
import jakarta.persistence.*;


@Entity @Table(name = "board_items")
public class BoardItem {
    public enum Type { TEXT, IMAGE, FILE, LINK, VIDEO, AUDIO }


    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(optional = false)
    private Board board;


    @Enumerated(EnumType.STRING)
    private Type type;


    @Column(columnDefinition = "text")
    private String textContent; // for TEXT/QUOTE/GOAL


    @Column(columnDefinition = "text")
    private String urlContent; // for IMAGE/LINK/VIDEO/MUSIC


    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Board getBoard() { return board; }
    public void setBoard(Board board) { this.board = board; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }
    public String getUrlContent() { return urlContent; }
    public void setUrlContent(String urlContent) { this.urlContent = urlContent; }
}