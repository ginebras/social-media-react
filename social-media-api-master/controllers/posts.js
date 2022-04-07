const Users=require('../models/users');
const Posts=require('../models/posts');

const controller={

	create:async(req,res)=>{
		if(req.file){
			const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;
			const filename=req.file.filename;
			req.body.image=`${basePath}${filename}`;

		}else{
			return res.status(400).send('no image');
		}

		const newPost=new Posts(req.body);

		try{
			let savedPost=await newPost.save();

			if(!savedPost) return res.status(400).send('could not create the post');
			return res.status(200).send(savedPost);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	update:async(req,res)=>{
		try{

			let existPost=await Posts.findById(req.params.id);
			if(!existPost) return res.status(404).send('post not exist');

			if(existPost.autor.toString()===req.body.autor){

				if(req.file){
					const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;
					const filename=req.file.filename;
					req.body.image=`${basePath}${filename}`;
				}

				let updatedPost=await existPost.updateOne({$set:req.body},{new:true});

				if(!updatedPost) return res.status(400).send('cannot update the post');
				return res.status(200).send('post updated');

			}else{
				return res.status(403).send('you can only update your posts');
			}

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	delete:async(req,res)=>{
		try{

			let existPost=await Posts.findById(req.params.id);
			if(!existPost) return res.status(404).send('post not exist');

			if(existPost.autor.toString()===req.body.autor){
				let deletedPost=await existPost.delete();
				if(!deletedPost) return res.status(400).send('post cannot be deleted');
				return res.status(200).send('deleted post'); 
			}else{
				return res.status(403).send('you can only delete your post');
			}

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	get:async(req,res)=>{

		try{
			let existPost=await Posts.findById(req.params.id);
			if(!existPost) return res.status(404).send('post not exist');

			return res.status(200).send(existPost);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	like:async(req,res)=>{

		try{
			let existPost=await Posts.findById(req.params.id);
			if(!existPost) return res.status(404).send('post not exist');

			if(!existPost.likes.includes(req.body.userId)){
				let like=await existPost.updateOne({$push:{likes:req.body.userId}});
				if(!like) return res.status(400).send('cannot like the post');
				return res.status(200).send('liked post');
			}else{
				let dislike=await existPost.updateOne({$pull:{likes:req.body.userId}});
				if(!dislike) return res.status(400).send('cannot dislike the post');
				return res.status(200).send('disliked post');
			}

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},


	timeline:async(req,res)=>{
		var allPosts=[];
		try{
			let currentUser=await Users.findById(req.params.id);
			if(!currentUser)return res.status(404).send('user not exist');

			let currentUserPosts=await Posts.find({autor:currentUser.id}).sort({createdAt:'descending'});
			if(!currentUserPosts)return res.status(404).send('posts not exist');

			let followingsPosts=await Promise.all(currentUser.following.map(friendId=>{
				return Posts.find({autor:friendId}).sort({createdAt:'descending'});
			}))

			allPosts=currentUserPosts.concat(...followingsPosts).sort(sortByDate);

			function sortByDate(a, b) {
			    if (a.createdAt < b.createdAt) {
			        return 1;
			    }
			    if (a.createdAt > b.createdAt) {
			        return -1;
			    }
			    return 0;
			}

			return res.status(200).send(allPosts);

		}catch(err){
			console.log(err);
			return res.status(500).send(err);
		}
	},

	userPosts:async(req,res)=>{

		try{
			const user=await Users.findOne({username:req.params.username});
			if(!user) return res.status(404).send('no user');

			const posts=await Posts.find({autor:user.id}).sort({createdAt:'descending'});
			if(!posts) return res.status(404).send('no posts');

			return res.status(200).send(posts);

		}catch(err){
			console.log(err);
			return res.status(500).send(err);
		}
	}
}

module.exports=controller;