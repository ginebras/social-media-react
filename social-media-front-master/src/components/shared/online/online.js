import React,{ useState,useEffect } from 'react';
import './online.css';

import axios from 'axios';

import { Link } from 'react-router-dom';

export default function Online({user}){
	const [ onlineUser,setUser ]=useState(null);

	useEffect(()=>{
		const getAxiosUser=async()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/users?userId=${user._id}`);
				setUser(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(user) getAxiosUser();
	},[user])

	return(
		<li className="rightbarFriend">
		
			<div className="rightbarProfileImgContainer">
				<img className="rightbarProfileImg" src={onlineUser?.profilePicture} alt="" />
				<span className="rightbarOnline"></span>
			</div>
			<Link className="rightbarUsername" style={{textDecoration:'none',color:'#343a40'}} to={`/profile/${onlineUser?.username}`}>{onlineUser?.username}</Link>
		</li>
	)
}