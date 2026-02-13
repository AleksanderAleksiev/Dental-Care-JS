import React, { useEffect, useState } from 'react';
import socket from '../utils/socket.js';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GetUserNameById } from '../api/UserApi.js';

const Chat = (props) => {

    const [message, setMessage] = useState('');
    const [appointmentWith, setAppointmentWith] = useState('');

    useEffect(() => {
        socket.emit('joinRoom', { username: props.username, room: props.chatRoom });

        const onMessage = (messages) => {
            console.log('messages', messages);
            let chatContainer = document.querySelector('.chat-container');
            chatContainer.innerHTML = '';
            messages.forEach(m => addMessage(m?.username, m?.text, m?.time));
        }

        socket.on('message', onMessage);

        return (() => {
            socket.off('message', onMessage);
        });
    }, []);

    useEffect(() => {
        GetUserNameById(props?.appointmentWith)
            .then(data => {
                setAppointmentWith(data.name);
            })
            .catch(err => {
                console.log('err', err);
            })
    }, []);

    const onChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    }

    const sendMessage = () => {
        socket.emit('chatMessage', message);
        setMessage('');
    }

    const addMessage = (username, message, timestamp = null) => {
        let chatContainer = document.querySelector('.chat-container');
        let messageContainer = document.createElement('div');
        messageContainer.className = 'message';
        const span1 = document.createElement('span');
        span1.innerText = username + ': ' + (timestamp ? timestamp : new Date().toLocaleString());
        const span2 = document.createElement('span');
        span2.innerText = message;
        messageContainer.appendChild(span1);
        messageContainer.appendChild(span2);
        chatContainer.appendChild(messageContainer);

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    return (
        <div
            style={{
                width: '500px',
                height: '650px',
                position: 'absolute',
                right: '50px',
                top: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '8px',
                border: '20px solid #1976d2'
            }}
        >
            <div style={{ width: '100%', height: '75px', background: '#1976d2' }}>
                <span style={{ color: 'white' }}>{props.appointmentTitle} : {props.appointmentDateTime}</span>
                <br />
                <span style={{ color: 'white' }}>Room: {props.chatRoom}</span>
                <br />
                <span style={{ color: 'white' }}>Appointment With: {appointmentWith ? appointmentWith : props.appointmentWith}</span>
            </div>
            <div className='chat-container' style={{ width: '100%', height: '500px', background: 'white', overflowY: 'auto' }}>
            </div>
            <div style={{ width: '100%', height: '75px', background: '#1976d2', display: 'flex', flexDirection: 'row' }}>
                <TextField 
                    value={message}
                    onChange={onChange}
                    name='message'
                    size='small'
                    style={{ position: 'relative', width: '90%', top: '40%', height: '100%' }}
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            border: '1px solid black'
                        },
                        '& .MuiOutlinedInput-input': {
                            textAlign: 'right'
                        }
                    }}
                />
                <IconButton style={{ position: 'relative', top: '15%', width: '10%' }} onClick={sendMessage}>
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Chat;