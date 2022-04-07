const Comments=require('../models/comments');
const Users=require('../models/user');
const Post=require('../models/posts');

const controller={

	post:async(req,res)=>{
		try{
			const existUser=await Users.findById(req.body.userId);
			if(!existUser) return res.status(404).send('no user real');

			const existPost=await Posts.findById(req.body.postId);
			if(!existPost) return res.status(404).send('no user post');

			const comment=new Comment(req.body);

			const saved=await comment.save();

			if(!saved) return res.status(400).send('not saved');
			return res.status(200).send(saved);
		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	}
}

module.exports=controller;