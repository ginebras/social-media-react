const express=require('express');
const app=express();

const server=require('http').Server(app);

const io=require('socket.io')(server,{
	cors:{
		origin:'http://localhost:3000'
	}
});


var users=[];

const addUser=(userId,socketId)=>{
	!users.some(user=>user.userId===userId) && users.push({userId,socketId});
}

const removeUser=socketId=>{
	users=users.filter(user=>user.userId!==socketId);
}

const getUser=socketId=>{
	return users.find(user=>user.userId===socketId);
}

io.on('connection',socket=>{
	console.log('user connected');

	socket.on('addUser',userId=>{
		addUser(userId,socket.id);
		io.emit('getUsers',users);
	});

	socket.on('sendMessage',({senderId,receiverId,text})=>{
		const user=getUser(receiverId);
		io.to(user.socketId).emit('getMessage',{senderId,text});
	});

	socket.on('disconnect',()=>{
		console.log('a user disconnected');
		removeUser(socket.id);
	});

})

server.listen(8900,()=>{
	console.log('sockets ok');
})