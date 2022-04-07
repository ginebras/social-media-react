//DEPENDENCIES
import React,{ useContext,useState,useEffect } from 'react';
import axios from 'axios';

//CSS
import { PermMedia,Label,Room,EmojiEmotions,Cancel } from '@material-ui/icons';
import './share.css';
import Swal from 'sweetalert2';

//OTERS
import AuthContext from '../../../context/auth/AuthContext';
import { useForm } from 'react-hook-form';

export default function Share({setPosted}){

	const { user }=useContext(AuthContext);
	const PF=process.env.REACT_APP_PUBLIC_FOLDER;

	const { register,handleSubmit, formState:{errors}}=useForm();

	const [ files,setFile ]=useState([]);
	const [ imagesUrl,setImagesUrl ]=useState([]);
	
	useEffect(()=>{
		if(files.length>0){
			const newImagesUrls=[];
			const filesToArray=[...files];
			filesToArray.forEach(image=>newImagesUrls.push(URL.createObjectURL(image)));
			setImagesUrl(newImagesUrls);
		}
	},[files])

	const onSubmit=async data=>{
		const formData=new FormData();
		for(let i=0;i<files.length;i++){
			formData.append('image',files[i],files[i].name);
		}
		formData.append('autor',user._id);
		formData.append('description',data.description);

		try{
			await axios.post('http://localhost:3700/api/posts/',formData);
			setPosted(true);
			Swal.fire(
			  'Good job!',
			  `New post created`,
			  'success'
			)
			setFile([]);
			setImagesUrl([]);
		}catch(error){
			console.log(error);
		}
	}

	const handleCancel=()=>{
		setFile([]);
		setImagesUrl([]);
	}

	return(
		<div className="share">
			<form className="shareWrapper" onSubmit={handleSubmit(onSubmit)}>
				<div className="shareTop">
					<img src={user?.profilePicture || PF+'/person/noAvatar.png'} alt="" className="shareProfileImg" />
					<input placeholder={user? `What's in your mind ${user?.username} ?` : "What's in your mind?"} type="text" className="shareInput" {...register('description',{required:true})} />
					{errors.description && (<div className="alert alert-danger" role="alert">Description required</div>)}
				</div>
				<hr className="shareHr" />
				{files.length>0 ? (
					<div className="shareImgContainer">
						<img src={imagesUrl[0]} className="shareImg" alt="" />
						<Cancel className="shareCancelImg" onClick={handleCancel} />
					</div>
				):null}
				<div className="shareBottom">
					<div className="shareOptions">
						<label className="shareOption" htmlFor="image">
							<PermMedia htmlColor="red" className="shareIcon" />
							<span className="shareOptionText">Photo or Video</span>
							<input style={{display:'none'}} type='file' id="image" accept=".jpeg,.jpg,.png" onChange={(e)=>setFile(e.target.files)} />
							{errors.image && (<div className="alert alert-danger" role="alert">Image required</div>)}
						</label>
						<div className="shareOption">
							<Label htmlColor="blue" className="shareIcon" />
							<span className="shareOptionText">Tags</span>
						</div>
						<div className="shareOption">
							<Room htmlColor="green" className="shareIcon" />
							<span className="shareOptionText">Location</span>
						</div>
						<div className="shareOption">
							<EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
							<span className="shareOptionText">Feelings</span>
						</div>
						<button className="shareButton" type="submit">Share</button>
					</div>
				</div>
			</form>
		</div>
	)
}