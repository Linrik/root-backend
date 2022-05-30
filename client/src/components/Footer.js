import React from 'react';
import Defaultbox from './helper/DefaultBox';
import EmailIcon from '@mui/icons-material/Email';
import {useTranslation} from "react-i18next";

import { Box, Button, Icon, IconButton, Paper } from '@mui/material';
import { Grid, Typography } from '@mui/material';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <Defaultbox sx={{
            width: '100%',
            m:0, p:0,
            marginTop: 'auto',
        }}>
            <Paper elevation={2} sx={{
                display:'flex',
                width: '100%',
                borderRadius: 0, pt:0, mt:3, 
                justifyContent:'center'
            }}>
                <Defaultbox 
                    sx={{width:'100%', maxWidth: '90vw', justifyContent:'space-evenly' }}
                    // container columns={{ xs: 1, sm: 2, md: 4, }}
                > 
                    {/* <img src={`https://i.ibb.co/WH2kxFR/Root-Icon2.png?w=16&h=16&fit=crop&auto=format`}
                        srcSet={(`https://i.ibb.co/WH2kxFR/Root-Icon2.png?w=16&h=crop&auto=format&dpr=2 2x`)}
                        alt={"/root"}
                        loading="lazy"
                        style={{ width: '150px', justifySelf:'flex-start'}}
                    /> */}
                    <Box sx={{
                        backgroundImage: `url("https://i.ibb.co/WH2kxFR/Root-Icon2.png?w=16&h=crop&auto=format&dpr=2 2x")`,
                        backgroundSize:'cover',
                        width:'150px', height:'50px',
                        backgroundPosition:'center center',
                        justifySelf:'flex-start'
                    }}></Box>
                    <Box >
                        {t('question_mail_us')}
                        <IconButton component="a" href={`mailto:root.usn@gmail.com`} aria-label="add to favorites">
                            <EmailIcon />
                        </IconButton>
                    </Box>
                </Defaultbox>
            </Paper>
        </Defaultbox>
    );
};

export default Footer;
