import React from 'react';

import TextField from '@mui/material/TextField';
import Defaultbox from '../components/helper/DefaultBox';
import { Box, Button, Grid, Typography } from '@mui/material';
import {useTranslation} from "react-i18next";
import Eventcard from '../components/EventCard';
import Article from '../components/Article';
import { Link } from 'react-router-dom';
import { LoginContext } from '../routerTemplate/Template';
const axios = require('axios').default

function getImage() {
    var random = parseInt(Math.random()*6);
    return itemData[random];
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

const sizeSequence = [
    12, 6, 6, 5, 7, 6, 6, 7, 5, 12, 5, 7
];

const Home = () => {
    
    const { t } = useTranslation();

    const [eventList, setEventList] = React.useState([]);
    const [ArticleList, setArticleList] = React.useState([]);
    const [myEventList, setMyEventList] = React.useState([]);

    const {login} = React.useContext(LoginContext);

    React.useEffect( () => {
        const fetchMyEvents = async () =>{
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

        const fetchEvents = async () =>{
            try {
                const request = await axios({
                    method: 'get',
                    url: '/api/event',
                    withCredentials: true,
                })
                var fullEventList = request.data;
                const eventList = [];
                
                for (let index = 0; index < (fullEventList.length < 5? fullEventList.length : 5); index++) {
                    eventList.push(fullEventList[index]);
                }
                setEventList(eventList);

            } catch(e){
                console.log(e);
            }
        }
      


        const fetchArticles = async () =>{
            try {
                const request = await axios({
                    method: 'get',
                    url: '/api/article',
                    withCredentials: true,
                })
                var fullArticleList = request.data;
                const newArticleList = [];
                
                for (let index = 0; index < (fullArticleList.length < 5? fullArticleList.length : 5); index++) {
                    newArticleList.push(fullArticleList[index]);
                }
                setArticleList(newArticleList);

            } catch(e){
                console.log(e);
            }
        }
    
        fetchEvents();
        fetchArticles();
        if(login.loginStatus){
            fetchMyEvents();
        }
    
    }, [setEventList, setArticleList, setMyEventList, login]);

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


    return (
        <Box>      
            <Defaultbox>  
                <Typography variant="h2" component={'h1'}>
                    {t('recent_events')}
                </Typography>
            </Defaultbox>

            <Defaultbox >
                {eventList.map((event, index) => {
                    return (
                        <Eventcard 
                            key={event.title+index} 
                            post ={event} 
                            image={getImage()} 
                            myEventList = {myEventList} 
                            in_handlejoinEvent = {handlejoinEvent}
                            in_handleCancelEvent = {handleCancelEvent}
                            isLoggedIn = {login.loginStatus}
                        />
                    )
                })}
            </Defaultbox>
            <Defaultbox>
                <Button component={Link} to={'/events'} >{t('go_to_page')}</Button>
            </Defaultbox>
            <Defaultbox>  
                <Typography variant="h2" component={'h1'} sx={{mt:'30px'}}>
                    {t('recent_articles')}
                </Typography>
            </Defaultbox>
                <Grid container columns={12}
                    alignItems="stretch" justifyContent={'center'}>
            <Defaultbox >
                {ArticleList.map((article, index) =>{
                    return(
                        <Box key={article.title + index} sx={{width:'275px', maxHeight:'500px', overflow:'hidden'}}>
                            <Article  className='ArticleTest' image={getImage()} in_post={article} margin={0} />
                        </Box>
                    )
                })}
            </Defaultbox>
                </Grid>
            <Defaultbox>
                <Button component={Link} to={'/articles'}>{t('go_to_page')}</Button>
            </Defaultbox>
        </Box>
    );
};

export default Home;
