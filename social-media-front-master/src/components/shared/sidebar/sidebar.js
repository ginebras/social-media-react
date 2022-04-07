//DEPENDENCIES
import React,{ useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//CSS
import { Chat } from "@material-ui/icons";
import './sidebar.css';

//CONTEXT && COMPONENTS
import CloseFriend from '../closeFriend/closeFriend';
import AuthContext from '../../../context/auth/AuthContext';

export default function Sidebar(){

	const [ friends,setFriends]=useState([]);
	const { user }=useContext(AuthContext);

	useEffect(()=>{
		const getAxiosFriends=async ()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/users/friendList/${user._id}`);
				setFriends(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(user) getAxiosFriends();

	},[user])

	return(
		 <div className="sidebar">
	      <div className="sidebarWrapper">
	        <ul className="sidebarList">
	          
	          <li className="sidebarListItem">
	            <Chat className="sidebarIcon" />
	            <Link style={{textDecoration:'none',color:'black'}} className="sidebarListItemText" to="/chat">Chats</Link>
	          </li>
	          
	        </ul>
	        <hr className="sidebarHr" />
	        
	        <ul className="sidebarFriendList">
				{ friends.map((user,index)=>(
					<CloseFriend key={index} user={user} />
				))}
			</ul>
	      </div>
	    </div>
	)
}