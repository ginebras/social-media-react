//DEPENDENCIES
import React,{ useState, useEffect,useContext,useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

//CSS
import './homeRightbar.css';

//OTHERS
import Online from '../online/online';
import AuthContext from '../../../context/auth/AuthContext';

export default function HomeRightbar(){
	const { user }=useContext(AuthContext);
	const socket=useRef();

	const [ friends,setFriends ]=useState([]);
	const [ onlineUsers,setOnlineUsers ]=useState([]);
	const [ onlineFriends,setOnlineFriends ]=useState([]);

	useEffect(()=>{
		socket.current=io('ws://localhost:8900');
	},[])

	useEffect(()=>{
		if(user){
			socket.current.emit('addUser',user._id)

			socket.current.on('getUsers',users=>{
				setOnlineUsers(user.following.filter(f=>users.some(u=>u.userId===f)));
			});
		}

	},[user])

	useEffect(()=>{
		const getAxiosFriends=async ()=>{
			try{	
				const response=await axios.get(`http://localhost:3700/api/users/friendList/${user._id}`);
				setFriends(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(user)
			getAxiosFriends();
	},[user])

	useEffect(()=>{
		friends.length>0 && setOnlineFriends(friends.filter(user=>onlineUsers.includes(user._id)));
	},[friends,onlineUsers])
	


	return(
		<>
			<div className="birthdayContainer">
				<img className="birthdayImg" src="/assets/gift.png" alt="" />
				<span className="birthdayText">
					<b>Pola Foster</b> and <b>other 3 friends </b> have a birthday today.
				</span>
			</div>
			<img className="rightbarAd" src="/assets/ad.png" alt="" />
			<h4 className="rightbarTitle">Online friends</h4>
			<ul className="rightbarFriendList">
				{ onlineFriends.map((user,index)=>(
					<Online key={index} user={user} />
				))}
			</ul>
		</>
	)
}