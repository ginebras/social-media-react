const Users=require('../models/users');

const controller={
	update:async(req,res)=>{
		if(req.body.userId===req.params.id || req.body.isAdmin){

			if(req.body.password){
				try{
					req.body.password=await bcrypt.hashSync(req.body.password,10);
				}catch(error){
					console.log(error);
					return res.status(500).send(error);
				}
			}

			if(req.file){
				const filename=req.file.filename;
				const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;

				req.body.profilePicture=`${basePath}${filename}`;
			}

			try{

				const updatedUser=await Users.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});

				return res.status(200).send({msg:'User account updated',username:updatedUser.username});

			}catch(error){
				console.log(error);
				return res.status(500).send(error);
			}

		}else{
			return res.status(403).send('Your only able to update your own account');
		}
	},

	delete:async(req,res)=>{
		if(req.body.userId===req.params.id || req.user.isAdmin){

			try{

				let user=await Users.findByIdAndDelete(req.params.id);
				
				if(!user) return res.status(404).send('User not found or not exist');
				return res.status(200).send('User deleted');

			}catch(error){
				console.log(error);
				return res.status(500).send(error);
			}

		}else{
			return res.status(403).send('You can only delete your account');
		}
	},

	user:async(req,res)=>{

		const userId=req.query.userId;
		const username=req.query.username;

		try{

			const user=userId? await Users.findById(userId) : await Users.findOne({username:username});
			if(!user) return res.status(404).send('User not found or not exist');
			
			const { password,updatedAt, ...other }=user._doc;			
			return res.status(200).send(other);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	follow:async(req,res)=>{
		if(req.body.userId!==req.params.id){
			try{
				const user=await Users.findById(req.params.id);
				const currentUser=await Users.findById(req.body.userId);
				if(!user.followers.includes(req.body.userId)){
					await user.updateOne({$push:{followers:req.body.userId}});
					await currentUser.updateOne({$push:{following:req.params.id}});
					return res.status(200).send('You are following this user');
				}else{
					return res.status(403).send('You already follow this user')
				}

			}catch(error){	
				console.log(error);
				return res.status(500).send(error);
			}

		}else{
			return res.status(403).send('You cannot follow yourself');
		}
	},

	unfollow:async(req,res)=>{
		if(req.body.userId!==req.params.id){
			try{
				const user=await Users.findById(req.params.id);
				const currentUser=await Users.findById(req.body.userId);
				if(user.followers.includes(req.body.userId)){
					await user.updateOne({$pull:{followers:req.body.userId}});
					await currentUser.updateOne({$pull:{following:req.params.id}});
					return res.status(200).send('You are unfollowing this user');
				}else{
					return res.status(403).send('You already unfollow this user')
				}

			}catch(error){	
				console.log(error);
				return res.status(500).send(error);
			}

		}else{
			return res.status(403).send('You cannot unfollow yourself');
		}
	},


	friendList:async(req,res)=>{
		var friendsData=[];
		try{
			const currentUser=await Users.findById(req.params.id);
			if(!currentUser) return res.status(404).send('user not exist');
			
			var friends=await Promise.all(
				currentUser.following.map(async friend=>{
					let friendFollowing=await Users.findById(friend);
					if(friendFollowing.following.includes(req.params.id)){
						return friendFollowing;
					}
				})
			)

			friends=friends.filter(friend=>friend==='null' || friend==='undefined' ? null: friend);
			friends.map(friend=>{
				const { _id,username,profilePicture }=friend;
				friendsData.push({_id,username,profilePicture});
			})

			return res.status(200).send(friendsData);
		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}

	},
}

module.exports=controller;