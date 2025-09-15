package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import com.aab.socialmediawebsitewithonlineboardsdemo.users.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BoardService {
    private final BoardRepository boards;
    private final BoardItemRepository items;
    private final UserService users;

    public BoardService(BoardRepository boards, BoardItemRepository items, UserService users) {
        this.boards = boards;
        this.items = items;
        this.users = users;
    }

    @Transactional
    public Board create(Long ownerId, String title, boolean isPrivate) {
        User owner = users.requireById(ownerId);
        Board b = new Board();
        b.setOwner(owner);
        b.setTitle(title);
        b.setPrivate(isPrivate);
        Board saved = boards.save(b);

        // Принудительно загружаем owner для избежания lazy loading проблем
        saved.getOwner().getUsername(); // Это инициализирует proxy

        return saved;
    }

    public Board getPublicOrOwned(Long boardId, Long requesterId) {
        // Используем метод с JOIN FETCH
        Board b = boards.findByIdWithOwnerAndItems(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));

        if (!b.isPrivate() || (requesterId != null && b.getOwner().getId().equals(requesterId))) {
            return b;
        }
        throw new SecurityException("Forbidden");
    }

    public List<Board> discover() {
        return boards.findPublicWithOwner();
    }

    public List<Board> getUserBoards(Long userId) {
        User user = users.requireById(userId);
        return boards.findByOwner(user);
    }

    @Transactional
    public BoardItem addItem(Long boardId, Long requesterId, BoardItem.Type type, String text, String url) {
        Board b = getPublicOrOwned(boardId, requesterId);
        if (!b.getOwner().getId().equals(requesterId)) {
            throw new SecurityException("Only owner can add items");
        }
        BoardItem it = new BoardItem();
        it.setBoard(b);
        it.setType(type);
        it.setTextContent(text);
        it.setUrlContent(url);
        return items.save(it);
    }

    @Transactional
    public void deleteItem(Long itemId, Long requesterId) {
        BoardItem it = items.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (!it.getBoard().getOwner().getId().equals(requesterId)) {
            throw new SecurityException("Only owner");
        }
        items.delete(it);
    }
}