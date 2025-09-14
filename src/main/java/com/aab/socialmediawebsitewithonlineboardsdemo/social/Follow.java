package com.aab.socialmediawebsitewithonlineboardsdemo.social;

import com.aab.socialmediawebsitewithonlineboardsdemo.users.User;
import jakarta.persistence.*;


@Entity @Table(name="follows")
@IdClass(FollowId.class)
public class Follow {
    @Id @ManyToOne @JoinColumn(name="follower_id")
    private User follower;
    @Id @ManyToOne @JoinColumn(name="followee_id")
    private User followee;


    public Follow() {}
    public Follow(User follower, User followee)
    {
        this.follower=follower; this.followee=followee;
    }
    public User getFollower(){
        return follower;
    }
    public User getFollowee(){
        return followee;
    }
}
