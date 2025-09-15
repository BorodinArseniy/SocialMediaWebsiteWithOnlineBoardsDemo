package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import com.aab.socialmediawebsitewithonlineboardsdemo.auth.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record BoardCreateReq(String title, boolean isPrivate) {}
record ItemCreateReq(String type, String textContent, String urlContent) {}

@RestController
@RequestMapping("/api")
public class BoardController {
    private final BoardService service;
    private final JwtUtil jwt;

    public BoardController(BoardService service,
                           @Value("${app.jwt.secret}") String secret,
                           @Value("${app.jwt.ttl-days}") long ttlDays) {
        this.service = service;
        this.jwt = new JwtUtil(secret, ttlDays);
    }

    private Long userIdFromBearer(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            return Long.parseLong(jwt.subject(authHeader.substring(7)));
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/boards/discover")
    public List<BoardDto> discover() {
        return service.discover().stream()
                .map(BoardDto::from)
                .toList();
    }

    @GetMapping("/boards/{id}")
    public ResponseEntity<BoardDto> get(@PathVariable Long id,
                                        @RequestHeader(value="Authorization", required=false) String auth) {
        Long uid = userIdFromBearer(auth);
        try {
            Board board = service.getPublicOrOwned(id, uid);
            return ResponseEntity.ok(BoardDto.from(board));
        } catch (SecurityException se) {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping(value = "/boards",
            consumes = "application/json",
            produces = "application/json")
    public ResponseEntity<BoardDto> create(@RequestBody BoardCreateReq req,
                                           @RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();

        try {
            Board board = service.create(uid, req.title(), req.isPrivate());
            BoardDto dto = BoardDto.from(board);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace(); // Для отладки
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/boards/{id}/items")
    public ResponseEntity<BoardItemDto> addItem(@PathVariable Long id,
                                                @RequestBody ItemCreateReq req,
                                                @RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();
        BoardItem.Type type = BoardItem.Type.valueOf(req.type());
        BoardItem item = service.addItem(id, uid, type, req.textContent(), req.urlContent());
        return ResponseEntity.ok(BoardItemDto.from(item));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId,
                                           @RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();
        service.deleteItem(itemId, uid);
        return ResponseEntity.noContent().build();
    }
}