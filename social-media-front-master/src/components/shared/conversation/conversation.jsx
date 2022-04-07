import React,{ useEffect,useState } from 'react';
import './conversation.css';

import axios from 'axios';

export default function Conversation({conversation,currentUser}){

	const [ user,setUser ]=useState({});
	const PF=process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(()=>{
		const getUser=async()=>{
			const userId=conversation.members.find(friendUser=>friendUser!==currentUser._id);
			try{
				const response=await axios.get(`http://localhost:3700/api/users?userId=${userId}`);
				setUser(response.data);
			}catch(error){
				console.log(error);
			}
		}

		getUser();
	},[])

	return(
		<div className="conversation" >
			<img className="conversationImg" src={user?.profilePicture || `${PF}/person/noAvatar.png`} alt=""/>
			<span className="conversationName">{user?.username}</span>
		</div>
	)
}