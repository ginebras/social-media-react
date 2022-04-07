import React,{ useState,useContext,useEffect } from 'react';
import './register.css';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import AuthContext from '../../../context/auth/AuthContext';

export default function Register(){

	const navigate=useNavigate();
	const { register,handleSubmit,formState:{errors} }=useForm();

	const { user,fetchingError,registerCall,nullError }=useContext(AuthContext);

	const [ verifyError,setError ]=useState(false);


	useEffect(()=>{
		if(user) 
			navigate('/');
		
	},[user])

	const onSubmit=async data=>{
		nullError();

		if(data.password!==data.passwordVerify){
			setError(true);
		}else{
			setError(false);
		}

		registerCall({email:data.email,username:data.username,password:data.password});
		navigate('/login');
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

						<input placeholder="Username" className="loginInput" type="text" {...register("username",{required:true})} />
						{errors.username && <span>Username field is required</span>}

						<input placeholder="Email" className="loginInput" type="email" {...register("email",{required:true})} />
						{errors.email && <span>Email field is required</span>}
						{ fetchingError? (
							<div className="alert alert-danger" role="alert">
							  {fetchingError}
							</div>
						):null}
						
						<input placeholder="Password" className="loginInput" type="password" {...register("password",{required:true,minLength:8,maxLength:16,pattern:/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/})}/>
						{errors.password && <span>
							password must contain 1 number (0-9)<br/>
							password must contain 1 uppercase letters<br/>
							password must contain 1 lowercase letters<br/>
							password must contain 1 non-alpha numeric number<br/>
							password is 8-16 characters with no space<br/>
						</span>}
						
						<input placeholder="Password again" className="loginInput" type="password" {...register("passwordVerify",{required:true,minLength:8,maxLength:16,pattern:/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/})} />
						{errors.passwordVerify && <span>Verify password field is required</span>}

						{verifyError? (
							<div className="alert alert-danger" role="alert">
							  Password not match
							</div>
						):null}
						

						<button className="loginButton" type="submit">Sign up</button>
						<button  className="loginRegisterButton" onClick={()=>navigate('/login')}>Log into account</button>
					</form>
				</div>
			</div>
		</div>
	)
}