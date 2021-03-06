import React from 'react';

import Scb from '../components/helper/SmallCenterBox';
import { Typography } from '@mui/material';

import { TextField } from '@mui/material';

import { Button } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';

import { fetchLogin } from '../App';
import { LoginContext } from '../routerTemplate/Template';
import {useTranslation} from "react-i18next";
import { Link, useNavigate, } from "react-router-dom";

const axios = require('axios').default

const Login = () => {

    const {t} = useTranslation();
    let navigate = useNavigate();

    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("");
    const {loginMode} = React.useContext(LoginContext);

    //Metode som sender axios request for å sjekke med database om innfyllt login informasjon er riktig, og sender bruker til hjemsiden ved suksess
    const handleSubmit = async (event) => {
        
        event.preventDefault();
        await axios({
            method: 'post',
            url: '/api/user',
            data: {
                email: userEmail,
                password: userPassword
            },
            withCredentials: true,
        }).then((response)=>{
            loginMode.Template();
            navigate('/')
        }).catch(function (error){
            console.log(error)
        })
    }

    //Sentrert login skjema med input for email og passord, og en knapp for redirect til registrerings-siden.
    return (
        <Scb>
            <Typography width="100%" variant="h2" component="h2" align="center">
            {t('login')}
            </Typography>

            {/* Skjema for inlogging */}
            <form onSubmit={handleSubmit}>
                <Defaultbox>
                    <TextField onChange={(e) => setUserEmail(e.target.value)} required fullWidth id="login_username" type="email"  label={t('email')} variant="outlined" />
                    <TextField onChange={(e) => setUserPassword(e.target.value)} required type="password" fullWidth id="login_password" label={t('password')} variant="outlined" />

                    <Button fullWidth type='submit' variant="contained" sx={{p:1}}>
                        {t('login')}
                    </Button>
                </Defaultbox>
            </form>
            <Defaultbox sx={{
                flexDirection: 'row',
                width: "100%"
            }}>

            {/* Link til registrerings siden */}
            <Button
                component={Link}
                to={'/register'}
                width="45%"
            >
            {t('register')}
            </Button>

            </Defaultbox>
        </Scb>
    );
};

export default Login;
