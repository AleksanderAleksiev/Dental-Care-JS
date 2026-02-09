import React, { useState } from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { Outlet } from "react-router-dom";

const Main = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className='Main'>
            <ResponsiveAppBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Outlet context={{ setIsLoggedIn }} />
        </div>
    );
}

export default Main;