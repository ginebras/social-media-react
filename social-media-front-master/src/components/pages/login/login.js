import React,{ useContext,useEffect } from 'react';
import './login.css';

import { useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';

import AuthContext from '../../../context/auth/AuthContext';

export default function Login(){

	const navigate=useNavigate();
	const { register,handleSubmit,formState:{errors} }=useForm();
	
	const authContext=useContext(AuthContext);
	const { user,fetchingError,token,loginCall,nullError,authenticatedUser }=authContext;

	useEffect(()=>{
		if(token)
			authenticatedUser();

		if(user)
			navigate('/');
	},[user,token])

	const onSubmit=data=>{
		nullError();

		loginCall(data);
		if(token)
			navigate('/');
	}

	return(
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">Reactive Social</h3>
					<span className="loginDesc">Connect with friends and the world around you on Reative Social</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleSubmit(onSubmit)}>
						<input placeholder="Email" className="loginInput" type="email" {...register("email",{required:true})} />
						{errors.email && <span>Email field is required</span>}
						{ fetchingError==='user not found or not exist'? (
							<div className="alert alert-danger" role="alert">
							  {fetchingError}
							</div>
						):null}
						
						<input placeholder="Password" className="loginInput" type="password" {...register("password",{required:true,minLength:8,maxLength:16,pattern:/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/})}/>
						{errors.password && <span>Password field is required</span>}
						{ fetchingError==='wrong password'? (
							<div className="alert alert-danger" role="alert">
							  {fetchingError}
							</div>
						):null}
						
						<button className="loginButton" type="submit">Log in</button>
						<span className="loginForgot">Forgot password?</span>
						<button  className="loginRegisterButton" onClick={()=>navigate('/register')}>Create a new account</button>
					</form>
				</div>
			</div>
		</div>
	)
}