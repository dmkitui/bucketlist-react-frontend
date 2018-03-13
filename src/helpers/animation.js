import React from 'react';
import ReactLoading from 'react-loading';

// Loading Types blank balls bars bubbles cubes cylon spin spinningBubbles spokes

const Animation = ({ type, color }) => (
    <ReactLoading delay={100} type={type} color={color} height='667' width='375' />
);
export default Animation;