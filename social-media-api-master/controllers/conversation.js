const Conversation=require('../models/conversation');
const Users=require('../models/users');

const controller={
	newConversation:async(req,res)=>{
		const newConversation=new Conversation({
			members:[req.body.senderId,req.body.receiverId]
		})

		try{
			const conversationOk=await newConversation.save();
			if(!conversationOk) return res.status(400).send('coult not create a new conversation');

			return res.status(200).send(conversationOk);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	getConversations:async(req,res)=>{
		try{
			const userExist=await Users.findById(req.params.userId);
			if(!userExist) return res.status(404).send('user not exist');

			const conversations=await Conversation.find({members:{$in:req.params.userId}});
			if(!conversations) return res.status(404).send('not conversations');

			return res.status(200).send(conversations);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	},

	getConversationBetween:async(req,res)=>{
		try{
			const conversation=await Conversation.findOne({members:{$in:[req.params.firstId,req.params.secondId]}});
			if(!conversation) return res.status(404).send('no conversation');

			return res.status(200).send(conversation);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	}
}

module.exports=controller;