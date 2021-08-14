import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Password = (props) => {
    const { id } = useParams();

    return <div>this is pass with the id {id}</div>;
};

export default Password;
