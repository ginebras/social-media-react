import React,{ useEffect,useState } from 'react';
import './chatOnline.css';

import axios from 'axios';

export default function ChatOnline({onlineUsers,currentId,setCurrentChat}){
	const [ friends,setFriends ]=useState([]);
	const [ onlineFriends,setOnlineFriends ]=useState([]);

	useEffect(()=>{
		const getAxiosFriends=async()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/users/friendList/${currentId}`);
				setFriends(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(currentId){
			getAxiosFriends();
		}
	},[currentId]);

	useEffect(()=>{
		friends.length>0 && setOnlineFriends(friends.filter(user=>onlineUsers.includes(user._id)));
	},[friends,onlineUsers])

	const handleClick=async friend=>{
		try{
			const response=await axios.get(`http://localhost:3700/api/conversation/${currentId}/${friend._id}`);
			setCurrentChat(response.data);
		}catch(error){
			console.log(error);
		}
	}

	return(
		<div className="chatOnline">
			{ onlineFriends.map((friend,index)=>(
				<div className="chatOnlineFriend" key={index} onClick={()=>handleClick(friend)}>
					<div className="chatOnlineImgContainer">
						<img src={friend?.profilePicture || '/assets/person/noAvatar.png'} alt="" className="chatOnlineImg"/>
						<div className="chatOnlineBadge"></div>
					</div>
					<div className="chatOnlineName">{friend.username}</div>
				</div>
			))}
		</div>
	)
}