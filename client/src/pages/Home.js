import React from 'react';

import Defaultbox from '../components/helper/DefaultBox';
import { Box, Button, Grid, Typography } from '@mui/material';
import {useTranslation} from "react-i18next";
import Eventcard from '../components/EventCard';
import Article from '../components/Article';
import { Link } from 'react-router-dom';
import { LoginContext } from '../routerTemplate/Template';
const axios = require('axios').default

const Home = () => {
    
    const { t } = useTranslation();

    const [eventList, setEventList] = React.useState([]);
    const [ArticleList, setArticleList] = React.useState([]);
    const [myEventList, setMyEventList] = React.useState([]);

    const {login} = React.useContext(LoginContext);
    
    /*Axios reqiest for å hente alle artikler, kortet ned til maks 5 */
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

    // Hendter påmeldte arrangementer for innlogget bruker, og alle arrangementer og artikler for fremvisning av top 5 nyeste.
    React.useEffect( () => {
        /*Axios reqiest for påmeldte arrangementer av innlogget bruker */
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
        
        if(login.loginStatus){
            fetchMyEvents();
        }

        /*Axios reqiest for å hente alle arrangementer, kortet ned til maks 5 */
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
        fetchEvents();
        fetchArticles();
    
    
    }, [setEventList, setArticleList, setMyEventList, login]);

    // Metode som kjører en axio request til backend om å legge innlogget bruker til et arrangement  
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

    // Metode som kjører en axio request til backend om å fjerne innlogget bruker fra et arrangement  
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

            {/* Viser frem alle artikler som er hentet fra databasen med innlogget brukers påmeldelses status*/}
            <Defaultbox >
                {eventList.map((event, index) => {
                    return (
                        <Eventcard 
                            key={event.title+index} 
                            post ={event}
                            myEventList = {myEventList} 
                            in_handlejoinEvent = {handlejoinEvent}
                            in_handleCancelEvent = {handleCancelEvent}
                            isLoggedIn = {login.loginStatus}
                        />
                    )
                })}
            </Defaultbox>

            {/* Knapp for å sende bruker til event siden */}
            <Defaultbox>
                <Button component={Link} to={'/events'} >{t('go_to_page')}</Button>
            </Defaultbox>


            <Defaultbox>  
                <Typography variant="h2" component={'h1'} sx={{mt:'30px'}}>
                    {t('recent_articles')}
                </Typography>
            </Defaultbox>
            {/* Viser frem en liste med de alle (0-5) artikler som ble hentet fra backend */}
            <Grid container columns={12}
                alignItems="stretch" justifyContent={'center'}>
                <Defaultbox >
                    {ArticleList.map((article, index) =>{
                        return(
                            <Box key={article.title + index} sx={{width:'275px', maxHeight:'500px', overflow:'hidden'}}>
                                <Article fetch={fetchArticles} className='ArticleTest' in_post={article} margin={0} />
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
