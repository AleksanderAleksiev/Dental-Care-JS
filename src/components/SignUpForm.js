import { TextField } from "@mui/material";
import React from "react";


const SignUpForm = ({ inputs, onChange, passwordForm, selectedValue }) => {

    return (
        <div style={{ marginTop: '50px' }}>
            <div>
                <TextField 
                    label='Name'
                    value={inputs.name}
                    onChange={onChange}
                    name='name'
                    size='small'
                    type='text'
                    required
                    sx={{marginRight: '10px'}}
                />
            </div>
            <br />
            <div>
                <TextField 
                    label='Email'
                    value={inputs.email}
                    onChange={onChange}
                    name='email'
                    size='small'
                    type='email'
                    required
                    sx={{marginRight: '10px'}}
                />

                <TextField 
                    label='Phone'
                    value={inputs.phone}
                    onChange={onChange}
                    name='phone'
                    size='small'
                    type='tel'
                    required
                />
            </div>
            <br />
            {passwordForm}
            <br />
            <div>
                <TextField 
                    label={selectedValue === 'dentist' ? 'Years Of Experience' : 'Age'}
                    value={inputs.years}
                    onChange={onChange}
                    name='years'
                    size='small'
                    type='number'
                    required
                    sx={{marginRight: '10px'}}
                />
                <TextField 
                    label={selectedValue === 'dentist' ? 'Practice Location' : 'Address'}
                    value={inputs.address}
                    onChange={onChange}
                    name='address'
                    size='small'
                    type='text'
                    required
                />
            </div>
        </div>

    );
}

export default SignUpForm;