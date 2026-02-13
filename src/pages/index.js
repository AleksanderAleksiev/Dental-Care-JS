import React, { useEffect, useState, useRef } from 'react';
import { GetUserApi, UpdateUserApi } from '../api/UserApi';
import { Button, TextField  } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Chat from '../components/Chat';
import { GetUserAppointmentsByDateRange } from '../api/AppointmentApi';
import moment from 'moment';
import { dateTimeLocalToUtc } from '../utils/dateTimeConverter';


const Homepage = () => {
    const navigate = useNavigate();

    const { setIsLoggedIn } = useOutletContext();

    const [user, setUser] = useState({});
    const [hasUserChanged, setHasUserChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const [chatRoom, setChatRoom] = useState(null);
    const [appointmentWith, setAppointmentWith] = useState('');
    const [appointmentTitle, setAppointmentTitle] = useState('');
    const [appointmentDateTime, setAppointmentDateTime] = useState('');
    // const [userCredentials, setUserCredentials] = useState({});

    useEffect(() => {
        GetUserApi()
            .then((data) => {
                setUser(data.user);
                setIsLoggedIn(true);
                // credentials = {...credentials, isDentist: data.user.is_dentist, id: data.user.id };
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');

                // setUserCredentials(credentials);
                fetchAppointments(data.user);
            })
            .catch((error) => {
                console.log('error', error);
                navigate('/login');
            })
    }, []);


    const userRef = useRef(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        if (user?.is_dentist === undefined || !user?.id) return;
        
        const interval = setInterval(() => {
            fetchAppointments(userRef.current);
        }, 60000);

        return () => clearInterval(interval);
    }, [user.is_dentist]);


    const fetchAppointments = async (user) => {
        let currentDate = new Date();
        let fromDate = moment(currentDate).startOf('day');
        let toDate = moment(currentDate).endOf('day');

        fromDate = dateTimeLocalToUtc(fromDate);
        toDate = dateTimeLocalToUtc(toDate);

        let dentistId = null, patientId = null;

        if (user.is_dentist) {
            dentistId = user.id;
            patientId = '';
        }
        else {
            dentistId = '';
            patientId = user.id;
        }

        await GetUserAppointmentsByDateRange(fromDate, toDate, dentistId, patientId)
            .then((appointments) => {
                checkAppointmentsTime(appointments, user);
            })
            .catch((err) => {
                console.log('error fetching appointments', err);
            })
    }

    const checkAppointmentsTime = (appointments, user) => {
        let currentDate = new Date();
        appointments.forEach(app => {
            if (moment(app.end_date).hours() === moment(currentDate).hours() && moment(app.end_date).minutes() <= moment(currentDate).minutes()) {
                setChatStarted(false);
                setChatRoom(null);
                setAppointmentWith('');
                setAppointmentTitle('');
                setAppointmentDateTime('');
            }
            else if (moment(app.start_date).hours() === moment(currentDate).hours() && moment(app.start_date).minutes() <= moment(currentDate).minutes() + 15) {
                setChatRoom(app.id);
                setAppointmentWith(user.id === app.dentist ? app.patient : app.dentist);
                setAppointmentTitle(app.title)
                setAppointmentDateTime(String(new Date(app.start_date).toLocaleTimeString() + ' - ' + new Date(app.end_date).toLocaleTimeString()));
                setChatStarted(true);
            }
        })
    }

    const onChange = (e) => {
        e.preventDefault();

        setUser((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));

        setHasUserChanged(true);
    }


    const handleSaveClick = () => {
        setLoading(true);

        UpdateUserApi({ ...user, image: '' })
            .then((data) => {
                setLoading(false);
                setHasUserChanged(false);
            })
            .catch((error) => {
                console.log('error', error);
                setLoading(false);
            })
    }

    // to display and update image and add login spinner

    return (
        <>
            <div style={{ textAlign: 'center', marginTop: '200px' }}>
                <div style={{ marginTop: '50px' }}>
                    <div>
                        <TextField 
                            label='Name'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={user.name}
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
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={user.email}
                            onChange={onChange}
                            name='email'
                            size='small'
                            type='email'
                            disabled
                            sx={{marginRight: '10px'}}
                        />
                        <TextField 
                            label='Phone'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={user.phone}
                            onChange={onChange}
                            name='phone'
                            size='small'
                            type='tel'
                            required
                        />
                    </div>
                    <br />
                    <br />
                    <div>
                        <TextField 
                            label={user.is_dentist ? 'Years Of Experience' : 'Age'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={user.years}
                            onChange={onChange}
                            name='years'
                            size='small'
                            type='number'
                            required
                            sx={{marginRight: '10px'}}
                        />
                        <TextField 
                            label={user.is_dentist ? 'Practice Location' : 'Address'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={user.address}
                            onChange={onChange}
                            name='address'
                            size='small'
                            type='text'
                            required
                        />
                    </div>
                </div>
                <LoadingButton 
                    sx={{ marginTop: '30px' }}
                    size='large'
                    variant='contained'
                    loading={loading}
                    disabled={!hasUserChanged}
                    onClick={handleSaveClick}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                >
                    Save
                </LoadingButton>
                <br />
                <Button
                    sx={{ marginTop: '30px' }}
                    size='large'
                    variant='contained'
                    onClick={() => navigate('/schedule')}
                >
                    Manage Schedule
                </Button>
                {!user.is_dentist && 
                    <Button
                        sx={{ marginTop: '30px', marginLeft: '20px' }}
                        size='large'
                        variant='contained'
                        onClick={() => navigate('/finddentist')}
                    >
                        Find Dentist
                    </Button>
                }
            </div>
            {chatStarted && 
                <Chat
                    username={user.name}
                    chatRoom={chatRoom}
                    appointmentWith={appointmentWith}
                    appointmentTitle={appointmentTitle}
                    appointmentDateTime={appointmentDateTime}
                />
            }
        </>
    )
}


export default Homepage;