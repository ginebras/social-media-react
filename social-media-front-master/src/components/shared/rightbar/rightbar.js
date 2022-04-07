import React from 'react';
import './rightbar.css';

import ProfileRightbar from '../homeRightbar/profileRightbar';
import HomeRightbar from '../profileRightbar/homeRightbar'

export default function Rightbar({user}){
	return(
		<div className="rightbar">
			<div className="rightbarWrapper">
				{ user ? (<ProfileRightbar user={user} />) : (<HomeRightbar />) }
			</div>
		</div>
	)
}