import axios from './AxiosWithCredentials';
import { REMOTE_URL } from '../constants';



export const GetUserAppointmentsByDateRange = async (startDate, endDate, dentistId, patientId) => {

    let queryString = '';

    if (startDate !== '' && startDate !== undefined) {
        queryString += 'start_date=' + startDate + '&'; 
    }

    if (endDate !== '' && endDate !== undefined) {
        queryString += 'end_date=' + endDate + '&';
    }

    if (dentistId) {
        queryString += 'dentist_id=' + dentistId + '&';
    }

    if (patientId) {
        queryString += 'patient_id=' + patientId + '&';
    }

    if (queryString !== '') {
        queryString = '?' + queryString;
    }

    const response = await axios.get(`${REMOTE_URL}/api/appointments/user_appointments${queryString}`);

    const data = await response.data;

    return data.appointments;
}


export const CreateAppointmentApi = async ({ title, notes, startDate, endDate, dentistId, patientId, allDay, recurrenceRule, excludedDates }) => {

    const response = await axios.post(`${REMOTE_URL}/api/appointments/create`, {
        'title': title,
        'description': notes,
        'start_date': startDate,
        'end_date': endDate, 
        'dentist': dentistId,
        'patient': patientId,
        'is_all_day': allDay,
        'recurrence_rule': recurrenceRule,
        'excluded_dates': excludedDates,
    });

    const data = await response.data;

    return data;
}



export const UpdateAppointmentApi = async ({ id, title, notes, startDate, endDate, dentistId, patientId, allDay, recurrenceRule, excludedDates }) => {

    const response = await axios.put(`${REMOTE_URL}/api/appointments/${id}`, {
        'title': title,
        'description': notes,
        'start_date': startDate,
        'end_date': endDate, 
        'dentist': dentistId,
        'patient': patientId,
        'is_all_day': allDay,
        'recurrence_rule': recurrenceRule,
        'excluded_dates': excludedDates,
    });

    const data = await response.data;

    return data;
}



export const DeleteAppointmentApi = async (appointmentId) => {
    const response = await axios.delete(`${REMOTE_URL}/api/appointments/${appointmentId}`);

    const data = await response.data;

    return data;
}
