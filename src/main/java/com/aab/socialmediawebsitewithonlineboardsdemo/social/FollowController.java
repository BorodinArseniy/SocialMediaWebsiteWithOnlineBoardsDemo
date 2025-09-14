package com.aab.socialmediawebsitewithonlineboardsdemo.social;

import com.aab.socialmediawebsitewithonlineboardsdemo.auth.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController @RequestMapping("/api/users")
public class FollowController {
    private final FollowService follows;
    private final JwtUtil jwt;
    public FollowController(FollowService follows,
                            @Value("${app.jwt.secret}") String secret,
                            @Value("${app.jwt.ttl-days}") long ttlDays){
        this.follows=follows;
        this.jwt=new JwtUtil(secret, ttlDays);
    }
    private Long uid(String h){
        if(h==null||!h.startsWith("Bearer "))
            return null;
        try {
            return Long.parseLong(jwt.subject(h.substring(7))); }
        catch(Exception e) {
            return null;
        }
    }


    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> follow(@PathVariable Long id, @RequestHeader("Authorization") String auth){
        Long me = uid(auth); if(me==null) return ResponseEntity.status(401).build();
        follows.follow(me, id); return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollow(@PathVariable Long id, @RequestHeader("Authorization") String auth){
        Long me = uid(auth); if(me==null) return ResponseEntity.status(401).build();
        follows.unfollow(me, id); return ResponseEntity.ok().build();
    }
}