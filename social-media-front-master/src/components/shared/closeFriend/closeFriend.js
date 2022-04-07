//DEPENDENCIES
import React from 'react';
import { Link } from 'react-router-dom';

//CSS
import './closeFriend.css';

export default function CloseFriend({user}){
	return(
		<li className="sidebarFriend">
			<img src={user?.profilePicture} alt="" className="sidebarFriendImg"/>
			<Link className="sidebarFriendName" to={`/profile/${user?.username}`} style={{textDecoration:'none',color:'grey'}}>{user?.username}</Link>
		</li>
	)
}