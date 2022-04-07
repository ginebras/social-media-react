import React,{ useEffect,useState,useContext } from 'react';
import './profile.css';

import Topbar from '../../shared/Topbar/Topbar';
import Rightbar from '../../shared/rightbar/rightbar';
import Sidebar from '../../shared/sidebar/sidebar';
import Feed from '../../shared/feed/feed';

import { useParams } from 'react-router-dom';
import axios from 'axios';

import AuthContext from '../../../context/auth/AuthContext';

export default function Profile(){

	const [ currentUser,setUser ]=useState({}); 

	const { user }=useContext(AuthContext);
	const username=useParams().username;

	useEffect(()=>{
		const getUser=async()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/users?username=${username}`);
				setUser(response.data);
			}catch(error){
				if(error.response.data==='User not found or not exist');
				setUser(null);
			}
		}

		if(username)
			getUser();
	},[username])

	return(
		<>
			<Topbar/>
			<div className="homeContainer">
				<Sidebar/>

				<div className="profileRight">
					{ currentUser ? (
						<>
							<div className="profileRightTop">
								<div className="profileCover">
									<img className="profileCoverImg" src={currentUser.coverPicture || "/assets/post/3.jpeg"} alt="" />
									<img className="profileUserImg" src={currentUser.profilePicture || "/assets/post/1.jpeg"} alt="" />
								</div>
								<div className="profileInfo">
									<h4 className="profileInfoName">{currentUser.username}</h4>
									<span className="profileInfoDesc">{currentUser.description}</span>
								</div>
							</div>
							<div className="profileRightBottom">
								<Feed username={username} currentUserProfile={user?.username===username? true : false}/>
								<Rightbar user={currentUser}/>
							</div>
						</>
					) : (<h2>No user was found</h2>)}
				</div>
			</div>
		</>
	)
}