package com.aab.socialmediawebsitewithonlineboardsdemo.social;

import java.io.Serializable;
import java.util.Objects;

public class FollowId implements Serializable {
    // Имена ДОЛЖНЫ совпадать с полями @Id в сущности Follow
    private Long follower;  // вместо followerId
    private Long followee;  // вместо followeeId

    public FollowId() {}
    public FollowId(Long follower, Long followee) {
        this.follower = follower;
        this.followee = followee;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowId)) return false;
        FollowId that = (FollowId) o;
        return Objects.equals(follower, that.follower)
                && Objects.equals(followee, that.followee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(follower, followee);
    }
}
