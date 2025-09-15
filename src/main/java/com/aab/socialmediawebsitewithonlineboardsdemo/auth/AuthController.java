package com.aab.socialmediawebsitewithonlineboardsdemo.auth;


import com.aab.socialmediawebsitewithonlineboardsdemo.users.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


record RegisterReq(String username, String email, String password) {}
record LoginReq(String username, String password) {}
record AuthResp(String token, UserDto user) {}


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwt;


    public AuthController(UserService userService,
                          @Value("${app.jwt.secret}") String secret,
                          @Value("${app.jwt.ttl-days}") long ttlDays) {
        this.userService = userService;
        this.jwt = new JwtUtil(secret, ttlDays);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@RequestHeader("Authorization") String auth) {
        Long uid = userIdFromBearer(auth);
        if (uid == null) return ResponseEntity.status(401).build();
        User u = userService.requireById(uid);
        return ResponseEntity.ok(UserDto.from(u));
    }

    private Long userIdFromBearer(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            return Long.parseLong(jwt.subject(authHeader.substring(7)));
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterReq req) {
        try {
            if (req.username() == null || req.username().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is required"));
            }
            if (req.password() == null || req.password().length() < 3) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password must be at least 3 characters"));
            }

            User u = userService.register(req.username().trim(), req.email(), req.password());
            return ResponseEntity.ok(UserDto.from(u));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Internal server error"));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResp> login(@RequestBody LoginReq req) {
        User u = userService.requireByUsername(req.username());
        if (!userService.passwordMatches(u, req.password()))
            return ResponseEntity.status(401).build();
        String token = jwt.generate(u.getId().toString());
        return ResponseEntity.ok(new AuthResp(token, UserDto.from(u)));
    }


}