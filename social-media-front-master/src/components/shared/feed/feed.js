import React,{ useEffect,useState,useContext } from 'react';
import './feed.css';

import Share from '../share/share';
import Post from '../post/post';

import axios from 'axios';
import AuthContext from '../../../context/auth/AuthContext';

export default function Feed({username,currentUserProfile}){

	const [ posts,setPosts ]=useState([]);
	const { user }=useContext(AuthContext);

	const [ posted,setPosted ]=useState(false);
	const [ reloadPosts,setReload ]=useState(false);

	useEffect(()=>{
		if(user){
			getPosts();
			setPosted(false);
			setReload(false);
		}
	

	},[user,username,currentUserProfile,posted,reloadPosts])

	const getPosts=async ()=>{
		const response= username ? 
			await axios.get('http://localhost:3700/api/posts/profile/'+username) :	
			await axios.get('http://localhost:3700/api/posts/timeline/'+user._id.toLocaleString());

		setPosts(response.data);
	}

	return(
		<div className="feed">
			<div className="feedWrapper">
				{ currentUserProfile? <Share setPosted={setPosted}/> : null}
				{ posts.length>0 ? posts.map((post,index)=>(
					<Post key={index} post={post} setReload={setReload} />
				)): <span>No posts yet...</span>}
			</div>
		</div>
	)
}