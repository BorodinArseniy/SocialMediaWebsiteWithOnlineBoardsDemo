package com.aab.socialmediawebsitewithonlineboardsdemo.social;


import com.aab.socialmediawebsitewithonlineboardsdemo.users.User;
import com.aab.socialmediawebsitewithonlineboardsdemo.users.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FollowService {
    private final FollowRepository follows; private final UserService users;
    public FollowService(FollowRepository follows, UserService users){ this.follows=follows; this.users=users; }


    @Transactional
    public void follow(Long followerId, Long followeeId){
        if (followerId.equals(followeeId)) return; // ignore
        User follower = users.requireById(followerId);
        User followee = users.requireById(followeeId);
        if (!follows.existsByFollowerAndFollowee(follower, followee))
            follows.save(new Follow(follower, followee));
    }


    @Transactional
    public void unfollow(Long followerId, Long followeeId){
        User follower = users.requireById(followerId);
        User followee = users.requireById(followeeId);
        follows.deleteByFollowerAndFollowee(follower, followee);
    }


    public List<Long> followeeIds(Long followerId){ return follows.findFolloweeIds(followerId); }
}