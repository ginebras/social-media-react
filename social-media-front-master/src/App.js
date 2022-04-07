import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

//PAGES
import Home from './components/pages/home/Home';
import Profile from './components/pages/profile/profile';
import Login from './components/pages/login/login';
import Register from './components/pages/register/register';
import Messenger from './components/pages/messenger/messenger';
import PostDetails from './components/pages/post-details/postDetails';

//CONTEXT
import AuthState from './context/auth/AuthState';

export default function App(){
  return(
    <>
      <AuthState>
        <BrowserRouter>
          
          <Routes>
              
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/profile/:username" element={<Profile/>} />
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/post-details/:id" element={<PostDetails/>} />
            <Route exact path="/register" element={<Register/>}/>
            <Route exact path="/chat" element={<Messenger/>}/>
          </Routes>

        </BrowserRouter>
      </AuthState>
    </>
  )
}