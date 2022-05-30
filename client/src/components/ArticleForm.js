import React from 'react';
import {Paper, TextField, Button, styled, Stack, Box, List, Grid, IconButton} from '@mui/material';
import {useTranslation} from "react-i18next";
import Defaultbox from '../components/helper/DefaultBox';
import FileInput from '../components/FileInput';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {useEffect} from 'react';
import { DateTime } from 'luxon';
import EventFormComponents from './EventFormComponents';
import { Typography } from '@mui/material';
import Spacebetween from './helper/SpaceBetween';
import FormData from 'form-data';
const axios = require('axios').default

const ArticleForm = ({fetch, setShowForm, in_postTitle, in_image, in_postDescription, in_startDate,in_startTime, in_endDate,  in_endTime, isEvent, in_isNewPost, in_id}) => {
    
    const { t } = useTranslation();

    const [postTitle, setTitle] = React.useState(in_postTitle === undefined ? "": in_postTitle);
    const [postDescription, setDescription] = React.useState(in_postDescription === undefined ? "" : in_postDescription);
    // const [postImage, setPostImage] = React.useState(in_image === undefined ? null : in_image);
    const [postImage, setPostImage] = React.useState();
    const [startDate, setStartDate] = React.useState(in_startDate === undefined ? new Date(DateTime.now()) : in_startDate);
    const [startTime, setStartTime] = React.useState(in_endDate === undefined ? new Date(DateTime.now()) : in_startTime);
    const [endDate, setEndDate] = React.useState(in_startTime === undefined ? new Date(DateTime.now()) : in_endDate);
    const [endTime, setEndTime] = React.useState(in_endTime === undefined ? new Date(DateTime.now()) : in_endTime);
    
    const convertToDateTime = (date, time) =>{
        const dateObject = new DateTime.fromObject(date.c);
        const timeObject = new DateTime.fromObject(time.c);
        const isoString = (dateObject.toISODate()+'T'+timeObject.toISOTime())

        const newDateTime = new Date(DateTime.fromISO(isoString));
        return newDateTime
    }


    const handleSubmitEvent = async (event) =>{
        const dateObjectStart = convertToDateTime(startDate, startTime);
        const dateObjectEnd = convertToDateTime(endDate, endTime);
        event.preventDefault();
        const d = new FormData();
        if(postImage!==undefined){
            d.append("image", postImage, postImage.name)
        }
        d.append("title", postTitle)
        d.append("description", postDescription)
        d.append("dateFrom", dateObjectStart)
        d.append("dateTo", dateObjectEnd)
        d.append("eventid", in_id)
        var method = in_isNewPost ? 'post' : 'put';
        await axios({
            method: method,
            url: "http://localhost:5000/event",
            data: d,
            withCredentials: true,
        }).then((response)=>{
            setShowForm(false);
            fetch();
        }).catch(function (error){
            console.log(error)
        })
    }

    const handleSubmitArticle = async (event) =>{
        event.preventDefault();
        const d = new FormData();
        if(postImage!==undefined){
            d.append("image", postImage, postImage.name)
        }
        d.append("title", postTitle)
        d.append("description", postDescription)
        d.append("articleid", in_id)
        var method = in_isNewPost ? 'post' : 'put';
        await axios({
            method: method,
            url: "http://localhost:5000/article",
            data: d,
            withCredentials: true,
        }).then((response)=>{
            setShowForm(false);
            fetch();
        }).catch(function (error){
            console.log(error)
        })

    }
    const handleClose = () =>{
        setShowForm(false);
    }

    const skjemaboxStyle = {
        width:"100%",
        justifyContent: 'space-between',
    };

    return(
        <Paper sx={{maxWidth:'1200px'}}>
            <form onSubmit={isEvent ? handleSubmitEvent : handleSubmitArticle} >
            <Defaultbox>
                <Spacebetween>
                    <Typography sx={{p:"0 10px",m:0}} variant="h4">{ t( (isEvent ? 'new_event' : "new_article") ) }</Typography>
                <Box>
                        <IconButton 
                            aria-label="close" 
                            onClick={handleClose} 
                            sx={{right: 8, top: 8,color: (theme) => theme.palette.grey[500], alignSelf:'end', marginTop:'-30px'}}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Spacebetween>

                <Defaultbox container sx = {{width:'100%', justifyContent:"space-between", alignItems:'flex-start'}}>
                    <TextField 
                    defaultValue={postTitle}
                    onChange={(e) => setTitle(e.target.value)} 
                    label = {t('post_title')} 
                    required id="outlined-required" 
                    sx={{flexGrow:1}}/>
                </Defaultbox>

                {isEvent && <EventFormComponents dateTimeState={{
                    startDate, setStartDate,
                    endDate, setEndDate,
                    startTime, setStartTime,
                    endTime, setEndTime
                }} t = {t}/>}
                
                <Defaultbox sx = {{
                    ...skjemaboxStyle,
                    alignContent: 'stretch'
                }}>
                    <TextField 
                        defaultValue={postDescription}
                        onChange={(e) => setDescription(e.target.value)}
                        id="outlined-multiline-static"
                        label={t('post_description')}
                        multiline
                        fullWidth
                        rows = {5}
                        required/>
                </Defaultbox>
                <Defaultbox sx = {{
                    ...skjemaboxStyle,
                    width:"100%",
                    justifyContent: 'left',
                }}>
                <FileInput imageData= {postImage} setImage = {setPostImage}>

                </FileInput>
                </Defaultbox>

                <Button type='submit' variant="contained" sx={{p:1, }}>
                    {t('upload')}
                </Button>
            </Defaultbox>   
            </form>
        </Paper>
    )    
}

ArticleForm.defaultProps = {
    isEvent: false,
}

export default ArticleForm;