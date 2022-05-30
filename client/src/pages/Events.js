import React from 'react'
import PropTypes from 'prop-types'
import Defaultbox from '../components/helper/DefaultBox'
import { Button, Grid, TextField, Typography } from '@mui/material'
import Paper1200p from '../components/helper/Paper1200p'
import Defaultboxcol from '../components/helper/DefaultBoxCol'
import EventCard from '../components/EventCard'
import {useTranslation} from "react-i18next";
import { Box } from '@mui/system'
import { LoginContext } from '../routerTemplate/Template';
const axios = require('axios').default


function getImage() {
  var random = parseInt(Math.random()*6);
  return itemData[random];
}

const handlejoinEvent = async (event_id) => {    

  await axios({
    method: "put",
    url: ("/api/event/participants"),
    data: {eventid: event_id},
    withCredentials: true,
}).then((response)=>{
    return true;
}).catch((error)=>{
    // error stuff
    return false;
})
}
const handleCancelEvent = async (event_id) => {    
  await axios({
    method: "delete",
    url: ("/api/event/participants"),
    data: {eventid: event_id},
    withCredentials: true,
}).then((response)=>{
    return true;
}).catch((error)=>{
    // error stuff
    return false;
})
}

const itemData = 
[
  'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
  'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62'    
];


const Events = () => {
  
  const { t } = useTranslation();

  const [eventList, setEventList] = React.useState([]);
  const [myEventList, setMyEventList] = React.useState([]);
  const {login, loginMode} = React.useContext(LoginContext);

  React.useEffect( () => {

    const fetchEvents = async () =>{
        try {
            const request = await axios({
                method: 'get',
                url: '/api/event',
                withCredentials: true,
            })
        setEventList(request.data);
        } catch(e){
            console.log(e);
        }
    }
    fetchEvents();

    var fetchMyEvents = null;
    if(login.loginStatus){
      fetchMyEvents = async () =>{
        try {
            const request = await axios({
                method: 'get',
                url: '/api/event/participants',
                withCredentials: true,
            })
            setMyEventList(request.data);
        } catch(e){
            console.log(e);
        }
      }
      fetchMyEvents();
    }


  }, [login.loginStatus, setEventList, setMyEventList]);

  return ( 
  <Box>        
    <Defaultbox>
      <Typography variant="h2" sx={{wordBreak: "break-all"}}>{t('events')}</Typography>
    </Defaultbox>
        <Defaultbox sx={{p:0, m:0}}>
          {eventList.map((event, index) => {
            return (
            <EventCard 
                key={event.title+index} 
                post ={event}
                in_handlejoinEvent={handlejoinEvent} 
                in_handleCancelEvent={handleCancelEvent} 
                myEventList={myEventList}
                isLoggedIn={login.loginStatus}
              />
          )})
          }
        </Defaultbox>
  </Box>
  )
}

Events.propTypes = {}

export default Events
