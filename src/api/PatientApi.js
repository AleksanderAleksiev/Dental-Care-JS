import axios from './AxiosWithCredentials';
import { REMOTE_URL } from '../constants';

export const patientSignUpApi = async ({ name, email, phone, password, years, address }) => {
    
    const response = await axios.post(`${REMOTE_URL}/auth/user/register`, {
        'name': name, 
        'email': email,
        'phone': phone,
        'password': password,
        'years': years,
        'address': address,
        'image': '',
        'is_dentist': false,
    });

    const data = await response.data;
    return { ...data, status: response.status };
}