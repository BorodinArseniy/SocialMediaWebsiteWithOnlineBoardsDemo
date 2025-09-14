package com.aab.socialmediawebsitewithonlineboardsdemo.social;


import com.aab.socialmediawebsitewithonlineboardsdemo.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    boolean existsByFollowerAndFollowee(User follower, User followee);
    void deleteByFollowerAndFollowee(User follower, User followee);


    @Query("select f.followee.id from Follow f where f.follower.id = ?1")
    List<Long> findFolloweeIds(Long followerId);
}