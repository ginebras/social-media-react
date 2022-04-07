const Users=require('../models/users');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const controller={
	register:async(req,res)=>{

		const existUser=await Users.findOne({email:req.body.email});
		if(existUser) return res.status(400).send('email already in use');
		
		const user=new Users({
			username:req.body.username,
			email:req.body.email,
			password:bcrypt.hashSync(req.body.password,10)
		})

		try{

			let saved=await user.save();

			if(!saved) return res.status(400).send('no se pudo guardar');
			return res.status(200).send(saved)

		}catch(error){
			console.log(error);
			return res.status(500).send(error);		
		}
	},

	login:async(req,res)=>{
		const secret=process.env.SECRET;
		try{
			const user=await Users.findOne({email:req.body.email});
			if(!user)return res.status(404).send('user not found or not exist');

			const validatedPassword=await bcrypt.compareSync(req.body.password,user.password);
			if(!validatedPassword) return res.status(400).send('wrong password');

			const payload={
				userId:user.id,
				email:user.email
			}

			const token=jwt.sign(payload,secret,{expiresIn:'3d'});

			return res.status(200).send({token});
		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	//WILL BE USE ONCE THE USER LOG IN AND GET THE TOKEN 
	authToken:async(req,res)=>{
		try{
			const user=await Users.findById(req.user.userId);
			if(!user)return res.status(404).send('user not exist');

			const { password,...other }=user._doc;

			return res.status(200).send(other);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	}
}

module.exports=controller;