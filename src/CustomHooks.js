import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const useSignUpForm = (callback) => {
    const [inputs, setInputs] = useState({});

    const handleSubmit = async (event) => {

        if(event) {
            event.preventDefault();
        }

        const data = await callback(inputs);
        return data;
    }

    const handleInputChange = (event) => {

        setInputs(inputs => ({
            ...inputs,
            [event.target.name]: event.target.value
        }));
    }

    return { 
        inputs,
        handleSubmit,
        handleInputChange,
    };
}

export default useSignUpForm;