package com.aab.socialmediawebsitewithonlineboardsdemo.auth;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

public class JwtUtil {
    private final SecretKey key;
    private final long ttlMillis;

    public JwtUtil(String secret, long ttlDays) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlMillis = ttlDays * 24L * 60 * 60 * 1000;
    }

    public String generate(String sub) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(sub)
                .issuedAt(Date.from(now))
                .expiration(new Date(now.toEpochMilli() + ttlMillis))
                .signWith(key)   // SecretKey
                .compact();
    }

    public String subject(String jwt) {
        return Jwts.parser()
                .verifyWith(key)   // теперь всё совпадает
                .build()
                .parseSignedClaims(jwt)
                .getPayload()
                .getSubject();
    }
}
