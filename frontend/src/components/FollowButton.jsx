import React from 'react'
import axios from 'axios'


export default function FollowButton({ userId, isFollowing, onChange }){
    const toggle = async () => {
        if (isFollowing) { await axios.delete(`/api/users/${userId}/follow`) }
        else { await axios.post(`/api/users/${userId}/follow`) }
        onChange && onChange(!isFollowing)
    }
    return <button className={`px-3 py-1 rounded border ${isFollowing? 'bg-gray-200':'bg-blue-600 text-white'}`} onClick={toggle}>{isFollowing? 'Following':'Follow'}</button>
}