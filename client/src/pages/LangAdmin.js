import React from 'react';
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

    //Setter selectedIndex state til if for valgt språk og endrer showform state
    const handleEdit = (id) => {
        setSelectedIndex(id);
        setShowForm(!showForm);
    }
    
    
    //Setter showForm state til false, og kjører en axios request som henter alle lagrede språk fra databasen.  
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

    //kjører en axios request som sletter valgt språk og oppdaterer språklisten 
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

    // Setter sate for valgt språk til ugyldig verdi og setter state for språkskjema til true
    const handleNewLng = () => {
        setSelectedIndex(-1);
        setShowForm(true);
    }

    //Henter språk en gang ved render
    React.useEffect(()=>{
        fetchLang()
    }, []);
    
    return (
        <Defaultbox>
            {/* Leter gjennom liste av hentede språk og viser dem frem */}
            <Paper sx={{
                width: '100%',
                maxWidth: '1200px'
            }}>
                {langList.map((v, k)=>(
                    <LangBox langID={k} key={v.language} langName={v.languagename} langInitial={v.language} handleEdit={handleEdit} handleDelete={handleDelete} t={t}/>
                ))}
            </Paper>

            {/* Conditional visning av enten en knapp for å åpne skjema for nytt språk, eller skjema (LangForm) for nytt språk basert på "showForm" state*/}
            {!showForm && <Button onClick={handleNewLng}>{t('new_language')}</Button>}
            {showForm && <LangForm langID={selectedIndex} langList={langList} fetchLang={fetchLang} t={t}/>}
        </Defaultbox>
    );
};

// Skjema som dukker opp ved endring av språk eller lage nytt språk
const LangForm = ({langID, langList, fetchLang, t}) => {

    const fields = React.useContext(langContext);

    // Sender inn data til server post om ny eller put om endre
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
            <form onSubmit={handleSubmit}>
                <Defaultboxcol sx={{p:0, m:0}}>
                <TextField
                      id={"lngName"}
                      label="Språk"
                      defaultValue={langID<0 ? "" : langList[langID].languagename===undefined ? "" : langList[langID].languagename}
                    />
                    <TextField
                      id={"lngInit"}
                      label="Språk Initialer"
                      defaultValue={langID<0 ? "" : langList[langID].language ===undefined ? "" : langList[langID].language}
                    />
                {fields.map((v, k)=>(
                    <TextField
                      id={"lng_"+v}
                      key={v}
                      label={v}
                      defaultValue={langID<0 ? "" : langList[langID].translate[v] ===undefined ? "" : langList[langID].translate[v]}
                    />
                ))}
                <Button type='submit'>{t('submit')}</Button>
                </Defaultboxcol>
            </form>
        </Defaultboxcol>
    </Paper1200p>)
}

// Box som holder på alle tilgjengelige språk
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

export default LangAdmin;
