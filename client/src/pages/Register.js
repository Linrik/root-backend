import React from 'react';

import Smallcenterbox from '../components/helper/SmallCenterBox';
import { Typography, TextField, Button } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';
import {useTranslation} from "react-i18next";
import { Link, useNavigate, } from "react-router-dom";
import { LoginContext } from '../routerTemplate/Template';

import axios from 'axios';

const Register = () => {
    
    const { t } = useTranslation();
    let navigate = useNavigate();

    const {loginMode} = React.useContext(LoginContext);
    const [regFirstName, setRegFirstName] = React.useState("");
    const [regLastName, setRegLastName] = React.useState("");
    const [regMail, setRegMail] = React.useState("");
    const [regPass, setRegPass] = React.useState("");
    const [regPassRep, setRegPassRep] = React.useState("");

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(regPass === regPassRep){
            await axios({
                method: 'post',
                url: 'http://localhost:5000/user/signup',
                data: {
                    email: regMail,
                    firstname: regFirstName,
                    lastname: regLastName,
                    password: regPass
                },
                withCredentials: true,
            }).then((response)=>{
                loginMode.Template();
                navigate('/')
                console.log(response)
            }).catch(function (error){
                console.log(error)
            })
        }
        console.log({regFirstName, regLastName, regMail, regPass, regPassRep})
        
    }

    return (
        
        <Smallcenterbox>
            <Typography width="100%" variant="h2" component="h2" align="center">
            {t('new_user')}
            </Typography>

            <form onSubmit={handleSubmit}>
            <Defaultbox sx={{
            m:0,p:0
            }}>
            <TextField onChange={(e) => setRegFirstName(e.target.value)} required fullWidth id="reg_firstname" label={t('first_name')} variant="outlined" />
            <TextField onChange={(e) => setRegLastName(e.target.value)} required fullWidth id="reg_lastname" label={t('last_name')} variant="outlined" />
            <TextField onChange={(e) => setRegMail(e.target.value)} required type="email" fullWidth id="reg_mail" label={t('email')} variant="outlined" />
            <TextField onChange={(e) => setRegPass(e.target.value)} required type="password" fullWidth id="reg_pass" label={t('password')} variant="outlined" />
            <TextField onChange={(e) => setRegPassRep(e.target.value)} required type="password" fullWidth id="reg_pass_rep" label={t('repeat_password')} variant="outlined" />

            <Button fullWidth type='submit' variant="contained" sx={{p:1}}>
            Registrer
            </Button>
            </Defaultbox>
            </form>
            <Defaultbox sx={{
                flexDirection: 'row',
                width: "100%"
            }}>
            <Button
                component={Link}
                to={'/login'}
                width="45%"
                sx={{

                }}
                >
                {t('login')}
            </Button>

            {/* <Link
            component="button"
            variant="body2"
            underline="none"
            width="45%"
            sx={{
            // color: 
            }}
            onClick={() => {
            console.info("I'm a button.");
            }}
            >
            {t('forgot_password')}
            </Link> */}
            </Defaultbox>
            
        </Smallcenterbox>
    );
};

export default Register;
