package com.aab.socialmediawebsitewithonlineboardsdemo.users;

public record UserDto(Long id, String username, String email) {
    public static UserDto from(User u) { return new UserDto(u.getId(), u.getUsername(), u.getEmail()); }
}