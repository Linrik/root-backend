import React from 'react';
import { Avatar, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { pink } from '@mui/material/colors';
import { TextField } from '@mui/material';
import {useTranslation} from "react-i18next";
import CircleIcon from '@mui/icons-material/Circle';
import { width } from '@mui/system';
import { FormControl, FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';
import Loading from './Loading';
import { LoginContext } from '../routerTemplate/Template';
import { type } from '@testing-library/user-event/dist/type';
import { useNavigate } from 'react-router-dom';
const axios = require('axios').default

const ProfileCard = (props) => {

    const {user} = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [editName, setEditName] = React.useState(false);
    const [editPassword, setEditPassword] = React.useState(false);

    const [currPasswordInputN, setCurrPasswordInputN] = React.useState("");
    const [currPasswordInputP, setCurrPasswordInputP] = React.useState("");
    const [currPasswordInputD, setCurrPasswordInputD] = React.useState("");
    const [updatedFName, setUpdatedFName] = React.useState(user.firstname);
    const [updatedLName, setUpdatedLName] = React.useState(user.lastname);
    const [newPassword, setNewPassword] = React.useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = React.useState("");
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
    const {loginMode} = React.useContext(LoginContext);


    //Endring av state for å endre navn state til sann
    const handleEditName = () => {
        setEditName(true);
    } 

    //Oppdatering av verdi for nytt fornavn
    const updateFirstName = (value) => {
        setUpdatedFName(value);
    }    
    //Oppdatering av verdi for nytt etternavn
    const updateLastName = (value) => {
        setUpdatedLName(value);
    }

    //Endring av state for å endre passord state til sann
    const handleEditPass = () => {
        setEditPassword(true);
    }    

    //Oppdatering av verdi for nytt passord
    const handleUpdatePass = (value) => {
        setNewPassword(value);
    }
    //Oppdatering av verdi for gjenntatt nytt passord
    const handleUpdatePassRepeat = (value) => {
        setNewPasswordRepeat(value);
    }

    
    //Oppdatering av verdi innskrevet passord til nytt navn
    const handlePasswordChangeN = (value) => {
        setCurrPasswordInputN(value);
    }    

    //Oppdatering av verdi innskrevet passord til nytt passord
    const handlePasswordChangeP = (value) => {
        setCurrPasswordInputP(value);
    }  
    
    //Oppdatering av verdi innskrevet passord til å slette bruker
    const handlePasswordChangeD = (value) => {
        setCurrPasswordInputD(value);
    }

    //Oppdatering av verdi innskrevet passord til nytt passord
    const handleCloseDialog = () => {
        setOpenConfirmDelete(false);
    }

    //Setter state for å åpne modal om sletting av bruker til sann
    const handleOpenDialog = () => {
        setOpenConfirmDelete(true);
    }

    
    
    //Sender put-request til backend hvor sjekk av nåværende og input passord skjer,
    //navn oppdateres ved ved sukksess, skjema byttes til disabled og passord input blir resatt.
    const confirmEditName = async () => {
        if(updatedFName !== user.firstname || updatedLName !== user.lastname){
            await axios({
                method: 'put',
                url: "/api/user",
                withCredentials: true,
                data: {
                    password: currPasswordInputN,
                    firstname: updatedFName,
                    lastname: updatedLName
                }
            }).then((response)=>{
                console.log(response)
                setEditName(false);
                setCurrPasswordInputN("")
            }).catch(function (error){
                console.log(error)
            })
        }else(
            console.log("username is the same")
        )
    }

    //Sender put-request til backend hvor sjekk av nåværende passord skjer, og oppdatering av passord skjer ved sukksess
    const confirmEditPass = async () => {

        if(newPassword === newPasswordRepeat){
            await axios({
                method: 'put',
                url: "/api/user/newpassword",
                withCredentials: true,
                data: {
                    password: currPasswordInputP,
                    newPassword: newPassword,
                }
            }).then((response)=>{
                console.log(response)
                setEditPassword(false);
                setCurrPasswordInputP("")
            }).catch(function (error){
                console.log(error)
            })
        }
    }

    //Sender put-request til backend hvor sjekk av nåværende passord skjer. Sletting av brukerkonto, utlogging redirect til hjemmesiden skjer ved sukksess.
    const handleDeleteUser = async () => {
        await axios({
            method: 'delete',
            url: "/api/user",
            withCredentials: true,
            data: {
                password: currPasswordInputD,
            }
        }).then((response)=>{
            console.log(response)
            console.log('User Deleted')
            loginMode.Template();
            navigate('/');
        }).catch(function (error){
            console.log(error)
        })

    }
    //Returnerer en brukerprofil 
    return (
        <Card sx={{ maxWidth: '960px', width: '100%', borderRadius: 0}}>
            {/* Bagrunnsbilde til profil */}
            <CardMedia
                component="img"
                height="280"
                image={'https://1.bp.blogspot.com/-jGzEyxRo5lA/Xu-gD2pjeCI/AAAAAAAAU90/oXBIHt6sXKc0vQp0_3CIxRzxTU3GpLMKwCK4BGAsYHg/w976-h549/DESKTOP-BACKGROUND-HEROSCREEN.CC-UHD-16-9-ASPECT.png'}
                alt="BannerImage"
            />
            {/* Sirkel med forbokstav til innlogget bruker*/}
            <Avatar
                sx={{
                    width: 102, height: 102,
                    bgcolor: pink[500],
                    margin: '-56px 0 0 20px'
                }}
            >
                {user.firstname.substring(0,1)}
            </Avatar>

            <CardContent sx={{
                p:4
            }}>
                
                <Typography gutterBottom variant="h4" component="h4" sx={{ textDecoration: 'underline'}}>
                    {user.firstname}
                </Typography>
                <Typography  color="text.secondary">
                {t('roles')}
                </Typography>

                
                {/* Liste med roller til bruker */}
                <List sx={{
                    padding: '0',
                    margin: '5px 0', listStyle:'inside'
                }}>
                { user.admin &&
                    <ListItem sx={{display:'list-item'}}>
                    {t('admin')}
                    </ListItem>
                }
                { user.admin &&
                    <ListItem sx={{display: 'list-item'}}>
                    {t('editor')}
                    </ListItem>
                }
                {user.rootMember &&
                    <ListItem sx={{display: 'list-item'}}>
                    {t('root_member')}
                    </ListItem>
                }
                </List>

                {/* Visning av fornavn og etternavn til bruker i diabled tekstfelt, eller et form for å håndtere enring av navn ved riktig (editName) state.
                    Viser også  felt for endring av passord om editPassword state er true*/}
                <Defaultbox sx={{
                    pt:5,m:0,
                    justifyContent: 'flex-start'
                }}>
                    <Defaultbox sx={{ flexDirection: 'column', p:0,m:0, width:'48%', justifyContent:'space-between' }}>                            
                        { !editName ?
                            <Defaultbox sx={{ flexDirection: 'column', p:0,m:0, width: '48%', justifyContent:'flex-start'}}>
                                <TextField disabled={true} label={t("first_name")} defaultValue={user.firstname} type={"text"}/>
                                <TextField disabled={true} label={t("last_name")} defaultValue={user.lastname} type={"text"}/>
                            </Defaultbox>
                                    :
                            <form onSubmit={confirmEditName}> 
                                <Defaultbox   efaultbox sx={{ flexDirection: 'column', p:0,m:0, width: '48%', justifyContent:'space-between'}}>
                                    <TextField label={t("first_name")} onChange={(e)=> {updateFirstName(e.target.value)}} defaultValue={user.firstname} type={"text"}/>
                                    <TextField label={t("last_name")} onChange={(e)=> {updateLastName(e.target.value)}} defaultValue={user.lastname} type={"text"}/>
                                    <TextField required label={t("current_password")}  onChange={(e)=> {handlePasswordChangeN(e.target.value)}} type={"password"}/>
                                    <Button  type="submit">{t('confirm_name')}</Button>
                                    </Defaultbox>
                            </form>

                        }
                    </Defaultbox>
                    
                    <Defaultbox sx={{ flexDirection: 'column', p:0,m:0, width: '48%', justifyContent:'space-between' }}>
                        {editPassword && 
                            <Defaultbox sx={{p:0,m:0}}> 
                                <TextField label={t("current_password")} onChange={(e)=> {handlePasswordChangeP(e.target.value)}} type={"password"}/>
                                <TextField label={t("new_password")} onChange={(e)=> {handleUpdatePass(e.target.value)}} type={"password"}/>
                                <TextField label={t("repeat_password")} onChange={(e)=> {handleUpdatePassRepeat(e.target.value)}} type={"password"}/>
                            </Defaultbox>
                        }
                    </Defaultbox>
                </Defaultbox>
            </CardContent>
            
            {/* Knapper for: 
                endring / bekreftelse av endring for navn basert på editName state.
                ending / bekreftelse av endring av passord basert på editPassword state.
                åpning av modal for sletting av bruker*/}
            <CardActions sx={{
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>            
                {editName ? 
                    <Button onClick={confirmEditName}>{t('confirm_name')}</Button> : 
                    <Button onClick={handleEditName}>{t('edit_name')}</Button>
                }
                {editPassword ? 
                    <Button onClick={confirmEditPass}>{t('confirm_password')}</Button> : 
                    <Button onClick={handleEditPass}>{t('change_password')}</Button>
                }
                <Button onClick={handleOpenDialog}>{t('delete_user')}</Button>



            </CardActions>
        {/* Modal for sletting av bruker basert på state "openConfirmDelete" */}
        <Dialog
                open={openConfirmDelete}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
        >
                <DialogTitle id="alert-dialog-title">
                {t('sure_about_delete')}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {t('delete_user_guide')}
                </DialogContentText>
                </DialogContent>
                <DialogActions sx={{display:'flex', justifyContent:'space-evenly'}}>
                    <Defaultbox>
                        <TextField onChange={(e) => handlePasswordChangeD(e.target.value)} type={'password'}label={t('current_password')}></TextField>
                        <Button onClick={handleDeleteUser} variant="outlined" color="error" >
                            {t('delete')}
                        </Button>
                    </Defaultbox>
                </DialogActions>
        </Dialog>   
        </Card>
    );
}

// returnerer hele profilsiden basert på login informasjon
const Profile = () => {
    const {login, loginMode} = React.useContext(LoginContext);

    return (
        <Defaultbox sx={{p:2, }}>
            <ProfileCard user={login.user} />
        </Defaultbox>
    );
};

export default Profile;
