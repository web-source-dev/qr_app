import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  const user_token = localStorage.getItem('user_token');
  return (
   
       <>
       <div className="navbar-of-users-pages">
        <div className="left-side-of-nav-bar-for-logo">
            <img src="https://marketplace.canva.com/EAF0Hq4UHjM/1/0/1600w/canva-orange-phoenix-animal-gaming-logo-WIPEOAyYPIs.jpg" width="50px" alt="" />
        </div>
        <div className="middle-of-nav-bar-for-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/help">Help</a>
        </div>
        <div className="right-side-of-nav-bar-for-profile-dropdown">
            {user_token ? (
                <div className="actions-to-view-profile">
                    <button  className="btn-18" style={{backgroundColor:"white"}}> <span> Profile</span></button>
                    <button  className="btn-18" style={{backgroundColor:"white"}}> <span> logout</span></button>
                </div>
            ):(
                <div className="login-signup-links">
                    <button  className="btn-18" style={{backgroundColor:"white"}}> <span> Login</span></button>
                    <button  className="btn-18" style={{backgroundColor:"white"}}> <span> SignUp</span></button>
                </div>
            )
            }
        </div>
       </div>
       </>
  )
}

export default Navbar;
