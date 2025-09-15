package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import com.aab.socialmediawebsitewithonlineboardsdemo.users.UserDto;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

public record BoardDto(
        Long id,
        String title,
        boolean isPrivate,
        Instant createdAt,
        Instant updatedAt,
        UserDto owner,
        List<BoardItemDto> items
) {
    public static BoardDto from(Board board) {
        // Безопасно загружаем owner
        UserDto ownerDto = null;
        if (board.getOwner() != null) {
            ownerDto = UserDto.from(board.getOwner());
        }

        // Безопасно загружаем items
        List<BoardItemDto> itemsDto = new ArrayList<>();
        if (board.getItems() != null) {
            try {
                itemsDto = board.getItems().stream()
                        .map(BoardItemDto::from)
                        .toList();
            } catch (Exception e) {
                // Если lazy loading не работает, оставляем пустой список
                itemsDto = new ArrayList<>();
            }
        }

        return new BoardDto(
                board.getId(),
                board.getTitle(),
                board.isPrivate(),
                board.getCreatedAt(),
                board.getUpdatedAt(),
                ownerDto,
                itemsDto
        );
    }
}

record BoardItemDto(
        Long id,
        BoardItem.Type type,
        String textContent,
        String urlContent
) {
    public static BoardItemDto from(BoardItem item) {
        return new BoardItemDto(
                item.getId(),
                item.getType(),
                item.getTextContent(),
                item.getUrlContent()
        );
    }
}