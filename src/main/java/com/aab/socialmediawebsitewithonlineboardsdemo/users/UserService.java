package com.aab.socialmediawebsitewithonlineboardsdemo.users;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository users) {
        this.users = users;
    }

    /** Регистрация */
    @Transactional
    public User register(String username, String email, String rawPassword) {
        if (email != null && users.existsByEmail(email)) {
            throw new IllegalArgumentException("Email уже используется");
        }
        if (users.existsByUsername(username)) {
            throw new IllegalArgumentException("Username уже используется");
        }
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(rawPassword));
        return users.save(u);
    }

    /** === Методы, которых ждёт твой контроллер === */
    @Transactional(readOnly = true)
    public User getById(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    @Transactional
    public void changePassword(Long userId, String newRawPassword) {
        User u = getById(userId);
        u.setPasswordHash(encoder.encode(newRawPassword));
        users.save(u);
    }

    /** Вспомогательные (может пригодиться в других сервисах) */
    @Transactional(readOnly = true)
    public User requireById(Long id) { return getById(id); }

    @Transactional(readOnly = true)
    public User requireByUsername(String username) {
        return users.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    public boolean passwordMatches(User u, String raw) {
        return encoder.matches(raw, u.getPasswordHash());
    }
}
