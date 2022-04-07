//DEPENDENCIES
import React,{ useState, useEffect,useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

//CSS
import './profileRightbar.css';
import { Add,Remove } from '@material-ui/icons';
import Swal from 'sweetalert2';

//CONTEXT
import AuthContext from '../../../context/auth/AuthContext';

export default function ProfileRightbar({user}){
	const PF=process.env.REACT_APP_PUBLIC_FOLDER;
	const navigate=useNavigate();

	const [ followed,setFollowed ]=useState(false);
	const [ friends,setFriends ]=useState([]);

	const { user:currentUser }=useContext(AuthContext);

	const [ files,setFiles ]=useState([]);
	const [ userToEdit,setUserToEdit ]=useState({
		username:'',
		email:'',
		city:'',
		from:'',
		relationship:1,
		description:'',
	});

	useEffect(()=>{
		const getAxiosFriends=async ()=>{
			try{	
				const response=await axios.get(`http://localhost:3700/api/users/friendList/${user?._id}`);
				setFriends(response.data);
			}catch(error){
				console.log(error);
			}
		}

		
		if(Object.keys(user).length!==0){
			getAxiosFriends();
		}
	},[user])

	useEffect(()=>{
		if(currentUser){
			setFollowed(currentUser.following.includes(user._id));
		}
	},[currentUser,user])

	useEffect(()=>{

		if(currentUser){
			const { _id,createdAt,followers,following,isAdmin,updatedAt,coverPicture,profilePicture,...others }=currentUser;
			setUserToEdit(others);
		}
	
	},[currentUser])

	const handleClick=async ()=>{
		try{
			if(followed)
				await axios.put(`http://localhost:3700/api/users/${user._id}/unfollow`,{userId:currentUser._id});
			else
				await axios.put(`http://localhost:3700/api/users/${user._id}/follow`,{userId:currentUser._id});

			setFollowed(!followed);

		}catch(error){
			console.log(error);
		}
	}

	const handleChanges=e=>{
		setUserToEdit({
			...userToEdit,
			[e.target.name]:e.target.value
		})
	}

	const handleUpdate=async e=>{
		e.preventDefault();
		const formData=new FormData();
		if(files.length>0){
			for(let i=0;i<files.length;i++){
				formData.append('profilePicture',files[i],files[i].name);
			}
		}

		formData.append('username',userToEdit.username);
		formData.append('description',userToEdit.description);
		formData.append('city',userToEdit.city);
		formData.append('from',userToEdit.from);
		formData.append('relationship',userToEdit.relationship);
		formData.append('email',userToEdit.email);
		formData.append('userId',currentUser._id);

		try{
			const response=await axios.put(`http://localhost:3700/api/users/${currentUser._id}`,formData);
			Swal.fire(
			  'Good job!',
			  `You updated your profile, reload the page to see the changes and go to /profile/${response.data.username}`,
			  'success'
			)
		}catch(error){
			console.log(error);
		}
	}

	return(
			<>
				{user?.username !== currentUser?.username? (
					<button className="rightbarFollowButton" onClick={handleClick}>
						{ followed? 'Unfollow' : 'Follow' }
						{ followed ? <Remove/>: <Add/> }
					</button>
					
				) : null}
				<h4 className="rightbarTitle">User information</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">City:</span>
						<span className="rightbarInfoValue">{user.city}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">From:</span>
						<span className="rightbarInfoValue">{user.from}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">Relationship:</span>
						<span className="rightbarInfoValue">
							{user.relationship===1 ?'Single':null}
							{ user.relationship===3 ?'Married':null}
							{ user.relationship===2 ?'Engagement' :null}
						</span>
					</div>
					{ user?.username===currentUser?.username ? (
						<div className="rightbarInfoItem">
				        	<button type="button" className="rightbarInfoKey rightbarFollowButton" data-bs-toggle="modal" data-bs-target="#editUserData">Edit information</button>
						</div>
					) : null}
				</div>
				<h4 className="rightbarTitle">User friends</h4>
				<div className="rightbarFollowings">
					{ friends.map((friend,index)=>(
						<div className="rightbarFollowing" key={index}>
							<img src={friend.profilePicture || `${PF}/person/noAvatar.png`} alt="" className="rightbarFollowingImg" />
							<Link className="rightbarFollowingName" to={`/profile/${friend.username}`}  style={{textDecoration:'none',color:'grey'}}>{friend.username}</Link>
						</div>
					)) }
				</div>






				<div className="modal fade" id="editUserData" tabIndex="-1" aria-hidden="true">
		        	<div className="modal-dialog modal-lg modal-dialog-centered">
		               <div className="modal-content">
		                  <div className="modal-header">
		                   <h5 className="modal-title">User information config</h5>
		                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		                  </div>

		                  <div className="modal-body">
		                     <form className="d-flex flex-row bd-highlight mb-3" onSubmit={handleUpdate}>
		                        <div className="p-2 w-50 bd-highlight">
		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> Username </span>
		                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="username" placeholder="Enter a new username" value={userToEdit?.username} />
		                           </div>
		                           
		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> Email </span>
		                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="email" placeholder="Enter a new email" value={userToEdit?.email} />
		                           </div>

		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> City </span>
		                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="city" placeholder="Where do you live?" value={userToEdit?.city}/>
		                           </div>

		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> From </span>
		                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="from" placeholder="Where are you from?" value={userToEdit?.from} />
		                           </div>

		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> Description </span>
		                              <input type="text" className="form-control" onChange={(e)=>handleChanges(e)} name="description" placeholder="Something about yourself" value={userToEdit?.description}/>
		                           </div>

		                           <div className="input-group mb-3">
		                              <span className="input-group-text"> Relationship </span>
		                              <select className="form-select" onChange={(e)=>handleChanges(e)} name="relationship" value={userToEdit?.relationship}>
		                              	<option value={1}>Single</option>
		                              	<option value={2}>Engagement</option>
		                              	<option value={3}>Married</option>
		                              </select>
		                           </div>

		                            <button type="submit" className="btn btn-primary">Save changes</button> 
		                        </div>
		   
		                        <div className="p-2 w-50 bd-highlight">
		                          <img width="250px" height="250px" alt="" src={currentUser?.profilePicture || '/assets/person/noAvatar.png'}/>
		                          <input type="file" className="m-2" name="profilePicture" onChange={e=>setFiles(e.target.files)} />
		                        </div>

		                     </form>
		                      
		                  </div>
		               </div>
		            </div>
		        </div>
			</>
		)
}