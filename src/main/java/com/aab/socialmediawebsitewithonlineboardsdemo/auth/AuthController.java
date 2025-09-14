package com.aab.socialmediawebsitewithonlineboardsdemo.auth;


import com.aab.socialmediawebsitewithonlineboardsdemo.users.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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


    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterReq req) {
        User u = userService.register(req.username(), req.email(), req.password());
        return ResponseEntity.ok(UserDto.from(u));
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