import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, TextField } from "@mui/material";
import { dentistSignUpApi } from "../api/DentistApi";
import { patientSignUpApi } from "../api/PatientApi";
import useSignUpForm from '../CustomHooks';
import SignUpForm from "./SignUpForm";
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    const [selectedValue, setSelectedValue] = useState('dentist');
    const [error, setError] = useState('');
    const { inputs, handleSubmit, handleInputChange } = useSignUpForm(
        selectedValue === 'dentist' ? dentistSignUpApi : patientSignUpApi);

    const navigate = useNavigate();
        
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }

    const handleSubmitClick = async (event) => {
        event.preventDefault();
        setError('');

        if (inputs.password !== inputs.repeat_password) {
            setError('passwords do not match');
        }
        else {
            let result = await handleSubmit();
            if (result.status === 201) {
                navigate('/login');
            }
        }
    }


    const passwordForm = (
        <div>
            <TextField
                label='Password'
                value={inputs.password}
                onChange={handleInputChange}
                name='password'
                size='small'
                type='password'
                required
                sx={{ marginRight: '10px' }}
            />
            <TextField
                label='Repeat Password'
                value={inputs.repeat_password}
                onChange={handleInputChange}
                name='repeat_password'
                size='small'
                type='password'
                error={error}
                helperText={error ? error : ''}
                required
            />
        </div>
    );

    return (
        <div style={{width: '100%', textAlign: 'center', marginTop: '50px' }}>
            <h1>Sign Up</h1>
            <form style={{margin: '50px auto'}} onSubmit={handleSubmitClick} >
                <FormControl >
                    <FormLabel>You are using DentalCare as a:</FormLabel>
                    <RadioGroup onChange={handleChange} value={selectedValue} style={{ display: 'inline' }}>
                        <FormControlLabel value='dentist' label='Dentist' control={<Radio />} />
                        <FormControlLabel value='patient' label='Patient' control={<Radio />} />
                    </RadioGroup>
                </FormControl>
                <SignUpForm inputs={inputs} onChange={handleInputChange} passwordForm={passwordForm} selectedValue={selectedValue} />
                <Button 
                    sx={{ marginTop: '30px' }}
                    size='large'
                    variant='contained'
                    type='submit'
                >
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default SignUp;