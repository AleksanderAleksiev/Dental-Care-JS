import { io } from 'socket.io-client';
import { REMOTE_URL } from '../constants';

const socket = io(REMOTE_URL);

export default socket;