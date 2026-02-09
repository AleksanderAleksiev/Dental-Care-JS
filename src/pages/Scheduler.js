import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  ViewSwitcher,
  Toolbar,
  DateNavigator,
  TodayButton,
  AllDayPanel,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { CreateAppointmentApi, DeleteAppointmentApi, GetUserAppointmentsByDateRange, UpdateAppointmentApi } from '../api/AppointmentApi';
import moment from 'moment';
import { dateTimeLocalToUtc } from '../utils/dateTimeConverter';
import { useLocation } from 'react-router-dom';


const UserScheduler = () => {
  
    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');
    const [addedAppointment, setAddedAppointment] = useState({});
    const [appointmentChanges, setAppointmentChanges] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [shouldRefetchData, setShouldRefetchData] = useState(true);

    const location = useLocation();

    let combinedSchedule = location?.state?.dentist;


    const getAppointments = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        setUser(user);

        let fromDate = null;
        let toDate = null;

        if (currentViewName === 'Day') {
            fromDate = moment(currentDate).startOf('day');
            toDate = moment(currentDate).endOf('day');
        }
        else if (currentViewName === 'Week') {
            fromDate = moment(currentDate).startOf('week');
            toDate = moment(currentDate).endOf('week');
        }
        

        fromDate = dateTimeLocalToUtc(fromDate);
        toDate = dateTimeLocalToUtc(toDate);

        let dentistId = '';
        let patientId = '';

        if (combinedSchedule) {
            dentistId = location.state.dentist.id;
            patientId = user.id;
        }
        else {
            dentistId = user.is_dentist ? user.id : '';
            patientId = user.is_dentist ? '' : user.id;
        }

        GetUserAppointmentsByDateRange(fromDate, toDate, dentistId, patientId)
                    .then((data) => {
                        formatData(data);
                        setShouldRefetchData(false);
                    })
                    .catch((error) => {
                        console.log('error', error);
                    })
    }


    useEffect(() => {
        getAppointments();
    }, []);

    
    useEffect(() => {
        if (shouldRefetchData) {
            getAppointments();
        }

    }, [shouldRefetchData]);

    useEffect(() => {
        getAppointments();
    }, [currentViewName, currentDate]);



    const formatData = (data) => {
        data.map((appointment) => {
            appointment['startDate'] = appointment['start_date'];
            appointment['endDate'] = appointment['end_date'];
            appointment['notes'] = appointment['description'];

            delete appointment['start_date'];
            delete appointment['end_date'];
            delete appointment['description'];
        })

        setData(data);
    }


    const handleCurrentDateChange = (date) => {
        setCurrentDate(date)
    }


    const handleCurrentViewNameChange = (viewName) => {
        setCurrentViewName(viewName);
    }

    const changeAddedAppointment = (addedAppointment) => {
        setAddedAppointment(addedAppointment);
    }

    const changeAppointmentChanges = (appointmentChanges) => {
        setAppointmentChanges(appointmentChanges);
    }

    const changeEditingAppointment = (editingAppointment) => {
        setEditingAppointment(editingAppointment);
    }


    const createAppointment = (appointment) => {

        appointment.startDate = dateTimeLocalToUtc(moment(appointment.startDate));
        appointment.endDate = dateTimeLocalToUtc(moment(appointment.endDate));
        
        if (combinedSchedule) {
            appointment.dentistId = location.state.dentist.id;
            appointment.patientId = user.id;
        }
        else {
            appointment.dentistId = user.is_dentist ? user.id : '';
            appointment.patientId = user.is_dentist ? '' : user.id;
        }

        appointment.recurrenceRule = '';
        appointment.excludedDates = '';

        CreateAppointmentApi({...appointment})
            .then(data => {
                setShouldRefetchData(true);
            })
            .catch((serverError) => {
                console.log('error', serverError);
            })
    }


    const modifyAppointment = (appointment) => {
        appointment.startDate = dateTimeLocalToUtc(moment(appointment.startDate));
        appointment.endDate = dateTimeLocalToUtc(moment(appointment.endDate));
        
        if (combinedSchedule) {
            appointment.dentistId = location.state.dentist.id;
            appointment.patientId = user.id;
        }
        else {
            appointment.dentistId = user.is_dentist ? user.id : '';
            appointment.patientId = user.is_dentist ? '' : user.id;
        }

        appointment.allDay = false;
        appointment.recurrenceRule = '';
        appointment.excludedDates = '';

        UpdateAppointmentApi({...appointment})
            .then((data) => {
                setShouldRefetchData(true);
            })
            .catch((serverError) => {
                console.log('error', serverError);
            })
    }


    const deleteAppointment = (appointmentId) => {

        DeleteAppointmentApi(appointmentId)
            .then(data => {
                setShouldRefetchData(true);
            })
            .catch((serverError) => {
                console.log('error', serverError);
            })
    }


    const commitChanges = ({ added, changed, deleted }) => {
        let newData = data;
        if (added) {
            const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0;
            newData = [...newData, { id: startingAddedId, ...added }];

            createAppointment(added);
        }
        if (changed) {
            let appointment;
            newData = newData.map((app) => {
                if (changed[app.id]) {
                    appointment = {...app, ...changed[app.id] };
                    return appointment;
                }
                else {
                    return app;
                }
            });

            modifyAppointment(appointment);
            
        }
        if (deleted !== undefined) {
            newData = newData.filter(appointment => appointment.id !== deleted);

            deleteAppointment(deleted);
        }
    }
    
    return (
        <div style={{ margin: '40px' }}>
            <h1>{combinedSchedule ? `${location?.state?.dentist.name}'s Schedule`: 'My Schedule' }</h1>
            <Paper style={{ marginTop: '40px', height: '700px' }}>
                <Scheduler
                    data={data}
                >
                    <ViewState
                        currentViewName={currentViewName}
                        currentDate={currentDate}
                        onCurrentDateChange={handleCurrentDateChange}
                        onCurrentViewNameChange={handleCurrentViewNameChange}
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                        addedAppointment={addedAppointment}
                        onAddedAppointmentChange={changeAddedAppointment}
                        appointmentChanges={appointmentChanges}
                        onAppointmentChangesChange={changeAppointmentChanges}
                        editingAppointment={editingAppointment}
                        onEditingAppointmentChange={changeEditingAppointment}
                    />
                    <IntegratedEditing />
                    <Toolbar />
                    <DateNavigator />
                    <ViewSwitcher />
                    <TodayButton />
                    <DayView
                        startDayHour={0}
                        endDayHour={24}
                    />
                    <WeekView
                        startDayHour={0}
                        endDayHour={24}
                    />
                    <Appointments />
                    <ConfirmationDialog />
                    <AppointmentTooltip showDeleteButton showOpenButton />
                    <AppointmentForm />
                    <AllDayPanel />
                </Scheduler>
            </Paper>
        </div>
    );
}


export default UserScheduler;