package com.aab.socialmediawebsitewithonlineboardsdemo.boards;

import com.aab.socialmediawebsitewithonlineboardsdemo.auth.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

record BoardCreateReq(String title, boolean isPrivate) {}
record ItemCreateReq(String type, String textContent, String urlContent) {}

@RestController
@RequestMapping("/api")
public class BoardController {
    private final BoardService service;
    private final BoardCanvasRepository canvasRepo;
    private final JwtUtil jwt;
    private final ObjectMapper objectMapper;

    public BoardController(BoardService service,
                           BoardCanvasRepository canvasRepo,
                           @Value("${app.jwt.secret}") String secret,
                           @Value("${app.jwt.ttl-days}") long ttlDays) {
        this.service = service;
        this.canvasRepo = canvasRepo;
        this.jwt = new JwtUtil(secret, ttlDays);
        this.objectMapper = new ObjectMapper();
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build();
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
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Получить canvas данные доски
    @GetMapping("/boards/{id}/canvas")
    public ResponseEntity<Map<String, Object>> getCanvas(@PathVariable Long id,
                                                         @RequestHeader(value="Authorization", required=false) String auth) {
        Long uid = userIdFromBearer(auth);
        try {
            // Проверяем доступ к доске
            Board board = service.getPublicOrOwned(id, uid);

            // Получаем canvas данные
            BoardCanvas canvas = canvasRepo.findByBoardId(id).orElse(null);

            if (canvas == null || canvas.getCanvasData() == null) {
                // Возвращаем пустой canvas
                return ResponseEntity.ok(Map.of(
                        "elements", List.of(),
                        "appState", Map.of()
                ));
            }

            // Парсим JSON и возвращаем
            Map<String, Object> canvasData = objectMapper.readValue(
                    canvas.getCanvasData(),
                    Map.class
            );
            return ResponseEntity.ok(canvasData);

        } catch (SecurityException se) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Сохранить canvas данные доски
    @PutMapping("/boards/{id}/canvas")
    public ResponseEntity<Void> saveCanvas(@PathVariable Long id,
                                           @RequestBody Map<String, Object> canvasData,
                                           @RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();

        try {
            // Проверяем, что пользователь - владелец доски
            Board board = service.getPublicOrOwned(id, uid);
            if (!board.getOwner().getId().equals(uid)) {
                return ResponseEntity.status(403).build();
            }

            // Находим или создаем canvas
            BoardCanvas canvas = canvasRepo.findByBoardId(id)
                    .orElseGet(() -> {
                        BoardCanvas newCanvas = new BoardCanvas();
                        newCanvas.setBoard(board);
                        return newCanvas;
                    });

            // Сохраняем данные как JSON
            String jsonData = objectMapper.writeValueAsString(canvasData);
            canvas.setCanvasData(jsonData);
            canvas.setUpdatedAt(Instant.now());

            canvasRepo.save(canvas);

            return ResponseEntity.ok().build();

        } catch (SecurityException se) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            e.printStackTrace();
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

    // Получить доски пользователя
    @GetMapping("/users/me/boards")
    public ResponseEntity<List<BoardDto>> myBoards(@RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();

        List<BoardDto> boards = service.getUserBoards(uid).stream()
                .map(BoardDto::from)
                .toList();
        return ResponseEntity.ok(boards);
    }
}
