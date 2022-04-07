//DEPENDENCIES
import React,{ useState,useEffect,useContext } from 'react';
import axios from 'axios';
import moment from 'moment';

//CSS
import './details.css';
import { MoreVert } from '@material-ui/icons';
import Swal from 'sweetalert2';

//OTHERS
import AuthContext from '../../../context/auth/AuthContext';

export default function Details({post}){

	const [ like,setLike ]=useState(post?.likes.length); 
	const [ isLiked,setIsLiked ]=useState(false);
	const [ user,setUser ]=useState({});
	const [ editPost,setEditPost ]=useState({
		description:post.description
	});
	const [ files,setFiles ]=useState([]);

	const { user:currentUser }=useContext(AuthContext);

	useEffect(()=>{
		setIsLiked(post.likes.includes(currentUser?._id));
	},[post.likes])

	useEffect(()=>{

		const getUser=async ()=>{
			const response=await axios.get(`http://localhost:3700/api/users?userId=${post.autor}`);
			setUser(response.data);
		}
		
		getUser();
	},[])
	

	const likeHandler=async ()=>{
		try{
			await axios.put(`http://localhost:3700/api/posts/${post._id}/like`,{userId:currentUser._id});
		}catch(error){
			console.log(error);
		}
		setLike(isLiked? like-1 : like+1);
		setIsLiked(!isLiked);
	}

	const handleDelete=async ()=>{
	    try{
			const sweet=await Swal.fire({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			})
			if(sweet.isConfirmed) {
				const response=await axios.delete(`http://localhost:3700/api/posts/${post._id}`,{data:{autor:post.autor}});
				Swal.fire(
			      'Deleted!',
			      'Your post has been deleted.',
			      'success'
			    )

			  }
			
		}catch(error){	
			console.log(error);
		}
	}



	const handleChanges=e=>{
		setEditPost({
			...editPost,
			[e.target.name]:e.target.value
		})
	}

	const handleUpdate=async e=>{
		e.preventDefault();
		
		const formData=new FormData();
		for(let i=0;i<files.length;i++ ){
			formData.append('image',files[i],files[i].name);
		}

		formData.append('autor',post.autor);
		formData.append('description',editPost.description);

		try{
			const response=await axios.put(`http://localhost:3700/api/posts/${post._id}`,formData);
		    Swal.fire(
		    	'Updated!',
		    	'Your post has been updated.',
		    	'success'
		    )
		}catch(error){
			console.log(error);
		}
	}


	return(
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<img src={ user?.profilePicture || "/assets/person/noAvatar.png"} className="postProfileImg" alt="" />
						<span className="postUsername">{ user?.username}</span>
						<span className="postDate">{ moment(post?.createdAt).fromNow() }</span>
					</div>
					<div className="postTopRight">
						{ post?.autor===currentUser?._id ? (
							<>
								<div className="dropdown">
								  <MoreVert data-bs-toggle="dropdown" aria-expanded="false"  id="dropdownMenuButton1"/>
								  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								    <li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit post</button></li>
								    <li><button className="dropdown-item" onClick={handleDelete}>Delete post</button></li>
								  </ul>
								</div>
							</>) : null}
					</div>
				</div>
				<div className="postCenter">
					<span className="postText">{post?.description}</span>
					<img src={post?.image || "/assets/person/noCover.png"} className="postImg" alt="" />
				</div>
				<div className="postBottom">
					<div className="postBottomLeft">
						<img src="/assets/like.png" className="likeIcon" onClick={likeHandler} alt="" />
						<img src="/assets/heart.png" className="likeIcon" onClick={likeHandler} alt="" />
						<span className="postLikeCounter">{like} people liked it</span>
					</div>
					<div className="postBottomRight">
						<span className="postCommentText">{post.comment?.length} comments</span>
					</div>
				</div>
			</div>



			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
	        	<div className="modal-dialog modal-lg modal-dialog-centered">
	               <div className="modal-content">
	                  <div className="modal-header">
	                   <h5 className="modal-title">Edit post</h5>
	                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	                  </div>

	                  <div className="modal-body">
	                     <form className="d-flex flex-row bd-highlight mb-3" onSubmit={e=>handleUpdate(e)}>
	                        <div className="p-2 w-50 bd-highlight">

	                           <div className="input-group mb-3">
	                              <span className="input-group-text"> Description </span>
	                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="description" placeholder="Something about yourself" value={editPost.description}/>
	                           </div>
							
							    <button type="submit" className="btn btn-primary">Update post</button> 
	                        </div>
	   
	                        <div className="p-2 w-50 bd-highlight">
	                          <img width="250px" height="250px" alt="" src={post?.image}/>
	                          <input type="file" className="m-2" id="image" name="image" accept=".jpeg,.jpg,.png" onChange={e=>setFiles(e.target.files)} />
	                        </div>

	                     </form>
	                      
	                  </div>
	               </div>
	            </div>
	        </div>
		</div>
	)
}