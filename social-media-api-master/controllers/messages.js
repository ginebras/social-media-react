const Messages=require('../models/messages');
const Conversation=require('../models/conversation');

const controller={
	sendMessages:async(req,res)=>{
		const newMessage=new Messages(req.body);

		try{
			const messageOk=await newMessage.save();
			if(!messageOk) return res.status(400).send('coult not send message');

			return res.status(200).send(messageOk);
		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	
	},

	getMessages:async(req,res)=>{
		try{
			const messages=await Messages.find({conversationId:req.params.conversationId});
			if(!messages) return res.status(404).send('not messages');

			return res.status(200).send(messages);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	}
}

module.exports=controller;