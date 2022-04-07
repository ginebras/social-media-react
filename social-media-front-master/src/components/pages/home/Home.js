import React from 'react';

import './Home.css';

import Topbar from '../../shared/Topbar/Topbar';
import Rightbar from '../../shared/rightbar/rightbar';
import Sidebar from '../../shared/sidebar/sidebar';
import Feed from '../../shared/feed/feed';

export default function Home(){

	return(
		<>
			<Topbar/>
			<div className="homeContainer">
				<Sidebar/>
				<Feed currentUserProfile={true}/>
				<Rightbar user={false}/>
			</div>
		</>
	)
}