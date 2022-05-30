import React from 'react';
import PropTypes from 'prop-types';
import Defaultbox from '../components/helper/DefaultBox';
import { Paper, Typography, Button, TextField } from '@mui/material';
import Paper1200p from '../components/helper/Paper1200p';
import Defaultboxcol from '../components/helper/DefaultBoxCol';
import Spacebetween from '../components/helper/SpaceBetween';
import { langContext } from '../App';
import { useTranslation } from 'react-i18next';
const axios = require('axios').default

const LangAdmin = () => {
    
    const { t } = useTranslation();

    const [langList, setLangList] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    const handleEdit = (id) => {
        setSelectedIndex(id);
        setShowForm(!showForm);
    }
    const fetchLang = async () =>{
        setShowForm(false)
        await axios({
            method: "get",
            url: "/api/language",
            withCredentials: true,
        }).then((response)=>{
            setLangList(response.data)
        }).catch((error)=>{
            console.log("DefinedError: ", error)
        })
    }
    const handleDelete = async (id) => {
        await axios({
            method: "delete",
            url: "/api/language/id/"+langList[id].language,
            withCredentials: true,
        }).then((response)=>{
            fetchLang();
        }).catch((error)=>{
            console.log("DefinedError: ", error)
        })
    }

    const handleNewLng = () => {
        setSelectedIndex(-1);
        setShowForm(true);
    }

    React.useEffect(()=>{
        fetchLang()
    }, []);
    
    return (
        <Defaultbox>
            <Paper sx={{
                width: '100%',
                maxWidth: '1200px'
            }}>
                {langList.map((v, k)=>(
                    <LangBox langID={k} key={v.language} langName={v.languagename} langInitial={v.language} handleEdit={handleEdit} handleDelete={handleDelete} t={t}/>
                ))}
            </Paper>
            {!showForm && <Button onClick={handleNewLng}>{t('new_language')}</Button>}
            {showForm && <LangForm langID={selectedIndex} langList={langList} fetchLang={fetchLang} t={t}/>}
        </Defaultbox>
    );
};

const LangForm = ({langID, langList, fetchLang, t}) => {

    const fields = React.useContext(langContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const inputFields = [];
        for(let i = 0; i<fields.length; i++){
            inputFields[fields[i]] = event.target[i*2+4].value;
        }
        const langData = {};
        Object.assign(langData, inputFields);
        await axios({
            method: langID<0 ? "post" : "put",
            url: "/api/language",
            data: {
                lngName: event.target[0].value,
                lng: event.target[2].value.toLowerCase(),
                translate: langData 
            },
            withCredentials: true,
        }).then((response)=>{
            fetchLang();
        }).catch((error)=>{
            console.log("DefinedError: ", error)
        })
    }
    return(<Paper1200p>
        
        <Defaultboxcol>
            {/* <Typography variant="body1">Språk: {langList[langID].initial.toUpperCase()} - {langList[langID].name}</Typography> */}
            <form onSubmit={handleSubmit}>
                <Defaultboxcol sx={{p:0, m:0}}>
                <TextField
                      id={"lngName"}
                      label="Språk"
                      defaultValue={langID<0 ? "" : langList[langID].languagename===undefined ? "" : langList[langID].languagename}
                    //   onChange={}
                      
                    />
                    <TextField
                      id={"lngInit"}
                      label="Språk Initialer"
                      defaultValue={langID<0 ? "" : langList[langID].language ===undefined ? "" : langList[langID].language}
                    //   onChange={}
                      
                    />
                {fields.map((v, k)=>(
                    <TextField
                      id={"lng_"+v}
                      key={v}
                      label={v}
                      defaultValue={langID<0 ? "" : langList[langID].translate[v] ===undefined ? "" : langList[langID].translate[v]}
                    // defaultValue={noListTemp[k]}
                    //   onChange={}
                      
                    />
                ))}
                <Button type='submit'>{t('submit')}</Button>
                </Defaultboxcol>
            </form>
        </Defaultboxcol>
    </Paper1200p>)
}

const LangBox = ({langID, langName, langInitial, handleEdit, handleDelete, t}) => {
    return(
        <Spacebetween>
            <Typography variant="h4">{langInitial.toUpperCase()} - {langName}</Typography>
            <Defaultbox sx={{
                alignItems:"center"
            }}>
                <Button onClick={()=>handleEdit(langID)} variant="text">{t('edit')}</Button>
                {langInitial.toLowerCase() === "no" ? 
                    <Button disabled variant="text">{t('delete')}</Button> :
                    <Button onClick={()=>handleDelete(langID)} variant="text">{t('delete')}</Button>
                }
            </Defaultbox>
        </Spacebetween>
    );
}


LangAdmin.propTypes = {

};


export default LangAdmin;
