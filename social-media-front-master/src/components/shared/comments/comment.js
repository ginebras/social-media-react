import React,{ useContext } from 'react';

import { ThumbUpAltSharp } from '@material-ui/icons';
import './comment.css';

import AuthContext from '../../../context/auth/AuthContext';

export default function Comment(){
	const { user }=useContext(AuthContext);

	return(
		<div className="comment">
			<div className="top-side-wrapper">
				<div className="top-side">
					<div className="top-left">
						<img alt="" src={user?.profilePicture} className="commentUserImg" />
						<span className="username">{user?.username}</span>
					</div>
					
					<div className="top-right">
						5
						<ThumbUpAltSharp className="likeIcon"/>
					</div>
				</div>
			</div>

			<div className="bottom-side">
				<span className="commentText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra, neque quis mattis eleifend, orci felis eleifend odio, eget interdum justo nisl eu libero. Praesent ullamcorper, elit et blandit viverra, neque nulla placerat massa, et euismod sapien massa at libero.</span>
			</div>
		</div>
	)
}