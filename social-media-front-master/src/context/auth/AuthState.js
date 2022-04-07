import React,{ useReducer } from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';

import axios from 'axios';

import { LOGIN_START,LOGIN_FAILURE,LOGIN_SUCCESS,REGISTER_START,REGISTER_FAILURE,REGISTER_SUCCESS,NULL_ERROR,AUTH_USER,LOGOUT } from '../actions';

const AuthState=props=>{
	
	const initialState={
		token:localStorage.getItem('token'),
		user:null,
		isFetching:false,
		fetchingError:null,
		logged:false,
	}


	const [state,dispatch]=useReducer(AuthReducer,initialState);

	const loginCall=async userData=>{
		dispatch({
			type:LOGIN_START
		})
		
		try{

			const response=await axios.post("http://localhost:3700/api/auth/login",userData);
			dispatch({
				type:LOGIN_SUCCESS,
				payload:response.data
			});

			authenticatedUser();

		}catch(error){
			console.log(error);
			dispatch({type:LOGIN_FAILURE,payload:error.response.data});
		}
	}

	const registerCall=async userData=>{
		dispatch({type:REGISTER_START});
		try{

			await axios.post('http://localhost:3700/api/auth/register',userData);
			
			dispatch({type:REGISTER_SUCCESS});

		}catch(error){
			console.log(error);
			dispatch({
				type:REGISTER_FAILURE,
				payload:error.response.data
			});
		}
	}


	const nullError=()=>{
		dispatch({type:NULL_ERROR});
	}

	const authenticatedUser=async ()=>{
		var token=localStorage.getItem('token');
		try{
			const response=await axios.get('http://localhost:3700/api/auth/authToken',{headers:{authorization:`Bearer ${token}`}});
			dispatch({
				type:AUTH_USER,
				payload:response.data
			})

		}catch(error){
			console.log(error);
			if(error.response.data==="User not authorized"){
				token=null;
				localStorage.removeItem('token');
			}
		}
	}

	const logout=async ()=>{
		dispatch({type:LOGOUT});
	}

	return(
		<AuthContext.Provider 
			value={{
				user:state.user,
				isFetching:state.isFetching,
				fetchingError:state.fetchingError,
				token:state.token,
				logged:state.logged,
				loginCall,
				registerCall,
				nullError,
				authenticatedUser,
				logout
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthState;