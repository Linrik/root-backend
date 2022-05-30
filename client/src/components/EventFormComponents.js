import React from 'react';
import {Paper, TextField, Button, styled, Stack, Box, List, Grid, IconButton} from '@mui/material';
import {useTranslation} from "react-i18next";
import Defaultbox from './helper/DefaultBox';
import FileInput from './FileInput';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'; 
import { DateTime } from 'luxon';
import Spacebetween from './helper/SpaceBetween';

function EventFormComponents({dateTimeState, t}) {

    const { 
        startDate, setStartDate,
        endDate, setEndDate,
        startTime, setStartTime,
        endTime, setEndTime
    } = dateTimeState;

return (
    <Spacebetween sx={{
        p:0,
        m:0
    }} >
    <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Defaultbox xs={5} md={5} sx={{
            justifyContent:"flex-start"
        }}>

            <DesktopDatePicker
            label={t('start_date')}
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={(newValue)=>{
                setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            />
            
            <TimePicker
            label={t('start_time')}
            value={startTime}
            onChange={(newValue)=>{
                setStartTime(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            />
        </Defaultbox>

        <Defaultbox xs={5} md={5} sx={{
            justifyContent:{
                xs:"flex-start",
                md:"flex-end"
            }
        }}>
            <DesktopDatePicker
                sx={{margin:'50px'}}
                label={t('end_date')}
                inputFormat="MM/dd/yyyy"
                value={endDate}
                onChange={(newValue)=>{
                    setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
                
            <TimePicker
                label={t('end_time')}
                value={endTime}
                onChange={(newValue)=>{
                    setEndTime(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </Defaultbox>
        </LocalizationProvider>
    </Spacebetween>
);
}

export default EventFormComponents;