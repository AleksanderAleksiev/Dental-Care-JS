import React, { useState, useEffect } from 'react';
import { GetDentistsApi } from '../api/DentistApi';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';


const DentistList = () => {

    const navigate = useNavigate();

    const [dentists, setDentists] = useState([]);

    useEffect(() => {
        getDentists();
    }, []);


    const getDentists = () => {
        GetDentistsApi()
            .then((data) => {
                setDentists(data.dentists);
            })
            .catch((serverError) => {
                console.log('error', serverError);
            })
    }


    const handleViewScheduleClick = () => {

    }


    const DentistCard = ({ dentist }) => {

        return (
            <Paper elevation={3}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Dentist
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 1.5 }} component="div">
                            {dentist.name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Practice Location: {dentist.address}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Email: {dentist.email}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Phone Number: {dentist.phone}
                        </Typography>
                        <Typography variant="body2">
                            Experience: {dentist.years}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" variant='contained' onClick={() => navigate('/schedule', { state: { dentist }})}>
                            View Schedule
                        </Button>
                    </CardActions>
                </Card>
            </Paper>
        );
    }


    return (
        <div>
            {dentists && dentists.length > 0 && 
                dentists.map((dentist) => {
                    return <DentistCard dentist={dentist} />;
                })
            }
        </div>
    )
}


export default DentistList;