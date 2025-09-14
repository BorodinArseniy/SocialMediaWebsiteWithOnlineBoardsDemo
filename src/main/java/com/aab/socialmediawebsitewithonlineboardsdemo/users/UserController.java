package com.aab.socialmediawebsitewithonlineboardsdemo.users;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    /** Регистрация пользователя (простой вариант). */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(@RequestBody @Valid RegisterDto dto) {
        User u = users.register(dto.username(), dto.email(), dto.password());
        return UserDto.from(u);
    }

    /** Получить пользователя по id. (можно оставить только для залогиненных) */
    @GetMapping("/{id}")
    public UserDto get(@PathVariable Long id) {
        return UserDto.from(users.getById(id));
    }

    /** Получить пользователя по email. (лучше закрыть авторизацией) */
    @GetMapping("/by-email")
    public UserDto getByEmail(@RequestParam @Email String email) {
        return UserDto.from(users.getByEmail(email));
    }

    /** Сменить пароль. (только для владельца/админа) */
    @PatchMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@PathVariable Long id, @RequestBody @Valid ChangePasswordDto dto) {
        users.changePassword(id, dto.newPassword());
    }

    // ---- DTOs ----
    public record RegisterDto(
            @NotBlank String username,
            @Email String email,
            @NotBlank String password
    ) {}

    public record ChangePasswordDto(@NotBlank String newPassword) {}

    public record UserDto(String id, String username, String email) {
        public static UserDto from(User u) {
            return new UserDto(u.getId().toString(), u.getUsername(), u.getEmail());
        }
    }
}
