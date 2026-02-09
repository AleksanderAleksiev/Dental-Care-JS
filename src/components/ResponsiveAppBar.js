import React from 'react';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { LogoutApi } from '../api/UserApi';
import { useNavigate } from 'react-router-dom';

function ResponsiveAppBar(props) {

  const navigate = useNavigate();

  const handleLogout = () => {
    LogoutApi()
      .then(() => {
        props?.setIsLoggedIn(false);
        localStorage.removeItem('user');
        navigate('/login');
      })
      .catch(err => {
        console.log('erro', err);
      })
  }

  return (
    <div style={{ display: 'flex', background: '#1976d2', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px'}}>
      <h6 style={{ fontWeight: 700, color: 'white', fontFamily: 'monospace', fontSize: '18px' }}>DentalCare</h6>
        {props.isLoggedIn && 
          <IconButton onClick={handleLogout}>
              <LogoutIcon />
          </IconButton>
        }
    </div>
  );
}

export default ResponsiveAppBar;