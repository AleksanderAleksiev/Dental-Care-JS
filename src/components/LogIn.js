import React from 'react';
import { Button, TextField } from '@mui/material';
import useSignUpForm from '../CustomHooks';
import { LoginApi } from '../api/UserApi';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const { inputs, handleSubmit, handleInputChange } = useSignUpForm(LoginApi);
    const navigate = useNavigate();

    const handleSubmitClick = (event) => {
        event.preventDefault();

        handleSubmit()
            .then((data) => {
                if (data.status === 'Success') {
                    navigate('/home');
                }
            })
            .catch((error) => {
                console.log('error', error);
            })
    }

    return (
        <div style={{width: '100%', textAlign: 'center', marginTop: '50px' }}>
            <h1>Log In</h1>
            <form style={{margin: '50px auto'}} onSubmit={handleSubmitClick} >
            <div>
                <TextField 
                    label='Email'
                    value={inputs.email}
                    onChange={handleInputChange}
                    name='email'
                    size='small'
                    type='email'
                    required
                    sx={{ marginRight: '10px' }}
                />
                <TextField
                    label='Password'
                    value={inputs.password}
                    onChange={handleInputChange}
                    name='password'
                    size='small'
                    type='password'
                    required
                />
            </div>
                <Button 
                    sx={{ marginTop: '30px' }}
                    size='large'
                    variant='contained'
                    type='submit'
                >
                    Log In
                </Button>
            </form>
        </div>
    );
}

export default Login;