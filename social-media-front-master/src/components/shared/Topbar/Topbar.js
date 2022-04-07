//DEPENDENCIES
import React,{ useContext,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

//CSS
import { Search,Person,Chat,Notifications } from '@material-ui/icons';
import './Topbar.css';

//CONTEXT && COMPONENTS
import AuthContext from '../../../context/auth/AuthContext';

export default function Topbar(){

	const { user,logout }=useContext(AuthContext);
	const PF=process.env.REACT_APP_PUBLIC_FOLDER;

	const { authenticatedUser }=useContext(AuthContext);
	const navigate=useNavigate();
	const token=localStorage.getItem('token');

	useEffect(()=>{
		if(token) authenticatedUser();
		else navigate('/login');
	},[token])

	return(
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link className="logo" to="/">Reactive social</Link>
			</div>
			<div className="topbarCenter">
				<div className="searchbar">
					<Search className="searchIcon" />
					<input className="searchInput" placeholder="Search for friend, post or video" />
				</div>
			</div>
			<div className="topbarRight">
				<div className="topbarLinks">
					<span className="topbarLink" onClick={()=>logout()}>Logout</span>
				</div>
				<div className="topbarIcons">
					<div className="topbarIconItem">
						<Person/>
						<span className="topbarIconBadge">1</span>
					</div>
					<div className="topbarIconItem">
						<Chat/>
						<span className="topbarIconBadge">2</span>
					</div>
					<div className="topbarIconItem">
						<Notifications/>
						<span className="topbarIconBadge">1</span>
					</div>
				</div>
				{ user ? (
					<Link to={`/profile/${user.username}`} >
						<img src={user?.profilePicture || `${PF}/person/noAvatar.png`} alt="person" className="topbarImg" />
					</Link>
				):(
					<Link to={'/login'} style={{color:'white'}} >
						<span>Log in</span>
					</Link>
				)}
				
			</div>
		</div>
	)
}