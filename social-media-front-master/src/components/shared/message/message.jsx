import React,{ useEffect , useState } from 'react';
import './message.css';

import axios from 'axios';
import moment from 'moment';

export default function Message({message,own}){
	const [ user,setUser ]=useState({});
	const PF=process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(()=>{
		const getUserData=async()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/users?userId=${message.senderId}`);
				setUser(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(message)
			getUserData();
	},[])

	return(
		<div className={own ? "message own" : "messsage"}>
			<div className='messageTop'>
				<img src={user.profilePicture || `${PF}/person/noAvatar.png`} alt="" className="messageImg" />
				<p className="messageText">{message?.text}</p>
			</div>
			<div className="messageBottom">{ moment(message?.createdAt).fromNow() }</div>
		</div>
	)
}