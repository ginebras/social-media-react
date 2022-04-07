import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './postDetails.css';

import Topbar from '../../shared/Topbar/Topbar';
import Rightbar from '../../shared/rightbar/rightbar';
import Sidebar from '../../shared/sidebar/sidebar';
import Details from '../../shared/postDetails/details';
import Comment from '../../shared/comments/comment';

export default function PostDetails(){
	
	const [ post,setPost ]=useState({});
	const params=useParams().id;

	useEffect(()=>{
		const getPost=async()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/posts/${params}`);
				setPost(response.data);

			}catch(error){
				console.log(error);
			}
		}

		getPost();

	},[])

	return(
		<>
			<Topbar/>
			<div className="homeContainer">
				<Sidebar/>
				<div className="feed">
					<div className="feedWrapper">
						{ Object.keys(post).length===0 ? (<>
							<span> Loading... or maybe the post not exist</span>
						</>) : (<Details post={post} />)}
						
						<Comment />
					</div>
				</div>
				<Rightbar user={false} />
			</div>
		</>
	)
}