package com.aab.socialmediawebsitewithonlineboardsdemo.users;

import com.aab.socialmediawebsitewithonlineboardsdemo.boards.Board;
import com.aab.socialmediawebsitewithonlineboardsdemo.social.Follow;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.*;


@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    private String username;


    @Column(nullable = false)
    @JsonIgnore
    private String passwordHash;


    @Column(unique = true)
    private String email;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "followee", fetch = FetchType.LAZY, cascade = {})
    private Set<Follow> followers = new HashSet<>();

    // на кого ЭТОТ пользователь подписан
    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY, cascade = {})
    private Set<Follow> followings = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Set<Follow> getFollowers() { return followers; }
    public void setFollowers(Set<Follow> followers) { this.followers = followers; }
    public Set<Follow> getFollowings() { return followings; }
    public void setFollowings(Set<Follow> followings) { this.followings = followings; }
    public List<Board> getBoards() { return boards; }
    public void setBoards(List<Board> boards) { this.boards = boards; }

}
