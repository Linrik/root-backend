import React from 'react';
import { useTranslation } from 'react-i18next';
import Defaultbox from '../components/helper/DefaultBox';
import Paper1200p from '../components/helper/Paper1200p';
import Button from '@mui/material/Button'

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
const axios = require('axios').default

// Side for å se logg og endre loggnivå
const Sitelog = () => {

    const [log, setLog] = React.useState();
    const [logLevel, setLogLevel] = React.useState();
    const [logActive, setLogActive] = React.useState(false);
    const {t} = useTranslation();

    // Henter inn nåværende konfigurasjon av logg
    const fetchLogLevel = async ()=>{
        await axios ({
            method:'get',
            url:"/api/admin/log",
            withCredentials: true
        }).then((response)=>{
            setLogLevel(response.data.level)
            setLogActive(!response.data.logger)
        })
        .catch(function (error){
            console.log(error)
        })
    }

    React.useEffect(()=>{
        // Henter logg fil
        const fetchLog = async ()=>{
            await axios ({
                method:'get',
                url:"/api/admin/fulllog",
                withCredentials: true
            }).then((response)=>{
                setLog(response.data)
            })
            .catch(function (error){
                console.log(error)
            })
        }
        fetchLog();
        fetchLogLevel();
    })

    const changeLevel = async(level) => {
        await axios ({
            method:'post',
            url:"/api/admin/log/"+level,
            withCredentials: true
        }).then((response)=>{
            fetchLogLevel();
        })
        .catch(function (error){
            console.log(error)
        })
    }

    const toggleLog = async(active) => {
        await axios ({
            method:'put',
            url:"/api/admin/log/"+(active?"off":"on"),
            withCredentials: true
        }).then((response)=>{
            fetchLogLevel();
        })
        .catch(function (error){
            console.log(error)
        })
    }

    const handleLevelChange = (event) =>{
        changeLevel(logLevel==="info" ? "error" : "info")
    }
    const handleLogToggle = (event) =>{
        console.log(logActive)
        toggleLog(logActive)
    }

    return (

        <Defaultbox>
            <Paper1200p sx={{
                p:3
            }}>
                <h1>{t("log_admin")}</h1>
                <h2>Level: {logLevel==="info" ? "Info+Error" : "Error"}</h2>
                <Button variant="text" onClick={handleLevelChange}>
                  Set level: {logLevel==="info" ? "Error" : "Info+Error"}
                </Button>
                <h2>Toggle log</h2>
                <FormGroup>
                <FormControlLabel control={<Switch
                checked={logActive}
                onChange={handleLogToggle}
                inputProps={{ 'aria-label': 'controlled' }}
                />} label={"log is "+(logActive ? "on":"off")} />
                </FormGroup>
                 <p></p>
                <pre style={{
                    whiteSpace: "pre-wrap"
                }}>{log}</pre>
            </Paper1200p>
        </Defaultbox>
    );
};

export default Sitelog;
