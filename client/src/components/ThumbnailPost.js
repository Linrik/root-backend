import React from 'react';
import {Paper, Button, Box, Stack} from '@mui/material';
import {useTranslation} from "react-i18next";
import ArticleForm from '../components/ArticleForm';
import Defaultbox from '../components/helper/DefaultBox';
import { DateTime } from 'luxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { useCookies } from "react-cookie";

    const ThumbnailPost = ({post, handleDelete, handleEdit, isEvent}) => {
        const { t } = useTranslation();

        const { title, description, image, _id, dateFrom, dateTo} = post;
        const [cookies, setCookie] = useCookies(["lng"]);

        function TimeBox() { 
            return(
                <Defaultbox sx ={{ m:0, gap:0}}>
                    <Stack>
                        <Defaultbox sx={{margin:0}}>
                            <label>{t('simple_from')}</label>
                        </Defaultbox>
                        <Defaultbox sx={{margin:0}}>
                            <label>{t('simple_to')}</label>
                        </Defaultbox>
                    </Stack>

                    <Stack>
                        <Defaultbox sx={{margin:0}}>
                            <label>{DateTime.fromISO(dateFrom).setLocale(cookies.lng).toLocaleString(DateTime.DATETIME_SHORT)}</label>
                        </Defaultbox>
                        <Defaultbox sx={{margin:0}}>
                            <label>{DateTime.fromISO(dateTo).setLocale(cookies.lng).toLocaleString(DateTime.DATETIME_SHORT)}</label>
                        </Defaultbox>
                    </Stack>
                </Defaultbox>)
        }

        const smallScreenXS = {width:{xs:'100%', md:'48%', lg:'25%'}, margin:0,}
        // var renderImage = ()

        return(
            <Defaultbox sx = {{alignItems: 'center', justifyContent: 'flex-start', borderBottom:1, maxWidth:'1200px'}}>
                <Box sx ={{}}>
                    {image!==undefined && <img srcSet={`http://localhost:5000/resources/${image}`} alt='' loading="lazy" style={{ width: '200px', }}/>}
                </Box>
                <Defaultbox sx = {{...smallScreenXS, }}>
                    <label>{title}</label>
                </Defaultbox>
                
                 {isEvent && <TimeBox/>}

                <Defaultbox sx={{...smallScreenXS, flexDirection:'column'}}>
                <Button  onClick = {() => handleEdit(_id)} sx={{maxHeight:'50px',paddingTop:'10px'}}>{t('edit')}</Button>                
                <Button  onClick = {() => {handleDelete(_id)}} sx={{maxHeight:'50px',paddingTop:'10px'}}>{t('delete')}</Button>
                </Defaultbox>
            </Defaultbox>
        );
    } 

    export default ThumbnailPost;