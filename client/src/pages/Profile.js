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


    const handleEditName = () => {
        setEditName(true);
    } 
    const updateFirstName = (value) => {
        setUpdatedFName(value);
    }    
    const updateLastName = (value) => {
        setUpdatedLName(value);
    }
    const handleEditPass = () => {
        setEditPassword(true);
    }    
    const handleUpdatePass = (value) => {
        setNewPassword(value);
    }
    const handleUpdatePassRepeat = (value) => {
        setNewPasswordRepeat(value);
    }
    const handlePasswordChangeN = (value) => {
        setCurrPasswordInputN(value);
    }    
    const handlePasswordChangeP = (value) => {
        setCurrPasswordInputP(value);
    }    
    const handlePasswordChangeD = (value) => {
        setCurrPasswordInputD(value);
    }
    const handleCloseDialog = () => {
        setOpenConfirmDelete(false);
    }
    const handleOpenDialog = () => {
        setOpenConfirmDelete(true);
    }

    
    
    //Sender put-request til backend hvor sjekk av nåværende og input passord skjer, og oppdatering av navn skjer ved sukksess
    const confirmEditName = async () => {
        if(updatedFName !== user.firstname || updatedLName !== user.lastname){
            await axios({
                method: 'put',
                url: "http://localhost:5000/user",
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
                url: "http://localhost:5000/user/newpassword",
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
    const handleDeleteUser = async () => {
        await axios({
            method: 'delete',
            url: "http://localhost:5000/user",
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

    return (
        <Card sx={{ maxWidth: '960px', width: '100%', borderRadius: 0}}>
            <CardMedia
                component="img"
                height="280"
                image={'https://1.bp.blogspot.com/-jGzEyxRo5lA/Xu-gD2pjeCI/AAAAAAAAU90/oXBIHt6sXKc0vQp0_3CIxRzxTU3GpLMKwCK4BGAsYHg/w976-h549/DESKTOP-BACKGROUND-HEROSCREEN.CC-UHD-16-9-ASPECT.png'}
                alt="BannerImage"
            />
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
            <CardActions sx={{
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>            
                {editName ? 
                    <Button  onClick={confirmEditName}>{t('confirm_name')}</Button> : 
                    <Button onClick={handleEditName}>{t('edit_name')}</Button>
                }
                {editPassword ? 
                    <Button onClick={confirmEditPass}>{t('confirm_password')}</Button> : 
                    <Button onClick={handleEditPass}>{t('change_password')}</Button>
                }
                <Button onClick={handleOpenDialog}>{t('delete_user')}</Button>



            </CardActions>
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

const Profile = () => {
    
    const {login, loginMode} = React.useContext(LoginContext);

    return (
        <Defaultbox sx={{p:2, }}>
            <ProfileCard user={login.user} />
        </Defaultbox>
    );
};

export default Profile;
