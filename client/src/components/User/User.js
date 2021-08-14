import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const User = (props) => {
    const { username } = useParams();

    return <div>This is {username}'s account</div>;
};

export default User;
