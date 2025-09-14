/**package com.aab.socialmediawebsitewithonlineboardsdemo.services;

import com.aab.socialmediawebsitewithonlineboardsdemo.users.User;
import com.aab.socialmediawebsitewithonlineboardsdemo.users.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository users;

    public AppUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) {
        User u = users.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(u.getUsername())
                .password(u.getPasswordHash())   // ВАЖНО: тут хэш из БД
                .authorities("USER")
                .build();
    }
}
**/
