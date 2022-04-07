import React,{ useContext,useState,useEffect,useRef} from 'react';
import './messenger.css';

import Topbar from '../../shared/Topbar/Topbar';
import Conversation from '../../shared/conversation/conversation';
import Message from '../../shared/message/message';
import ChatOnline from '../../shared/chatOnline/chatOnline';

import AuthContext from '../../../context/auth/AuthContext';
import axios from 'axios';

import {io} from 'socket.io-client';

export default function Messenger(){

	const { user }=useContext(AuthContext);
	const [ conversations,setConversations ]=useState([]);
	const [ currentChat,setCurrentChat ]=useState(null);
	const [ messages,setMessages ]=useState([]);
	const [ onlineUsers,setOnlineUsers ]=useState([]);
	const [ arrivalMessage,setArrivalMessage ]=useState(null);
	const [ newMessage,setNewMessage ]=useState("");
	const socket=useRef();
	const scrollRef=useRef();

	useEffect(()=>{
		socket.current=io('ws://localhost:8900');

		socket.current.on('getMessage',data=>{
			setArrivalMessage({
				senderId:data.senderId,
				text:data.text,
				createdAt:Date.now()
			})
		})
	
	},[])

	useEffect(()=>{
		arrivalMessage && 
			currentChat?.members.includes(arrivalMessage.senderId) && 
			setMessages(prev=>[...prev,arrivalMessage]);
	},[arrivalMessage,currentChat])

	useEffect(()=>{
		if(user){
			socket.current.emit('addUser',user?._id);
			
			socket.current.on('getUsers',users=>{
				setOnlineUsers(user.following.filter(user=>users.some(u=>u.userId===user)));
			});
		}
		
	},[user])

	useEffect(()=>{
		const getAxiosConversations=async ()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/conversation/${user._id}`); 
				setConversations(response.data);
			}catch(error){
				console.log(error);
			}
		}

		if(user)
			getAxiosConversations();

	},[user])

	useEffect(()=>{		

		const getAxiosMessages=async ()=>{
			try{
				const response=await axios.get(`http://localhost:3700/api/messages/${currentChat._id.toLocaleString()}`);
				setMessages(response.data);
			}catch(error){
				console.log(error);
			}
		}


		if(currentChat){
			getAxiosMessages();
		}


	},[currentChat])

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behavior:'smooth'});

	},[messages]);

	const handleSendMessage=async e=>{	
		e.preventDefault();

		const msg={
			senderId:user._id,
			text:newMessage,
			conversationId:currentChat._id.toLocaleString()
		}

		const receiverId=currentChat.members.find(member=>member !== user._id);

		socket.current.emit('sendMessage',{
			senderId:user._id,
			receiverId,
			text:newMessage
		});

		try{
			const response=await axios.post(`http://localhost:3700/api/messages/`,msg);
			setMessages([...messages,response.data]);
			setNewMessage("");

		}catch(error){
			console.log(error);
		}
	}

	return(
		<>
			<Topbar/>
			<div className="messenger">
				<div className="chatMenu">
					<div className="chatMenuWrapper">
						<input placeholder="Search for friends" className="chatMenuInput" />
						{ conversations.map((conversation,index)=>(
							<div onClick={()=>setCurrentChat(conversation)} key={index} >
								<Conversation conversation={conversation} currentUser={user}/>
							</div>
						))}
					</div>
				</div>
				<div className="chatBox">
					<div className="chatBoxWrapper">
						{ currentChat ? (<>
							<div className="chatBoxTop">
								{ messages.map((message,index)=>(
									<div key={index} ref={scrollRef}>
										<Message own={message.senderId===user._id} message={message} />
									</div>
								))}
							</div>
							<div className="chatBoxBottom">
								<textarea className="chatMessageInput" placeholder="Write something..." value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}></textarea>
				                <button className="chatSubmitButton" onClick={e=>handleSendMessage(e)}>Send</button>
							</div>
						</>): <span className="noConversationText">Choose a conversation to start chating</span>  }
					</div>
				</div>
				<div className="chatOnline">
					<div className="chatOnlineWrapper">
						<ChatOnline onlineUsers={onlineUsers} currentId={user?._id} setCurrentChat={setCurrentChat} />
					</div>
				</div>
			</div>
		</>
	)
}