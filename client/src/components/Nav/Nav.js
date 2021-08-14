import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Nav = (props) => {
    return (
        <nav>
            <h1>Password Manager</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/vault">My Passwords</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/user/:username">Settings</Link>
            </div>
        </nav>
    );
};

export default Nav;
