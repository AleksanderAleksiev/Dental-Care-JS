import axios from './AxiosWithCredentials';
import { REMOTE_URL } from '../constants';

export const LoginApi = async ({ email, password }) => {
    const response = await axios.post(`${REMOTE_URL}/auth/login/`, {
        'email': email,
        'password': password,
    });

    const data = await response.data;
    return data;
}


export const LogoutApi = async () => {
    const response = await axios.get(`${REMOTE_URL}/auth/logout`);
    const data = await response.data;
    return data;
}

export const GetUserApi = async () => {
    const response = await axios.get(`${REMOTE_URL}/auth/user/me`);

    const data = await response.data;
    return data;
}


export const UpdateUserApi = async (user) => {
    const response = await axios.put(`${REMOTE_URL}/auth/user/me`, user);
    const data = await response.data;

    return data;
}

export const GetUserNameById = async (userId) => {

    let queryString = '';

    if (userId !== '' && userId !== undefined) {
        queryString += 'id=' + userId + '&'; 
    }

    if (queryString !== '') {
        queryString = '?' + queryString;
    }

    const response = await axios.get(`${REMOTE_URL}/auth/user/name${queryString}`);

    const data = await response.data;
    return data;
}