import React from 'react';

import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useCookies } from "react-cookie";

import i18next from 'i18next';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
import {ColorModeContext} from '../routerTemplate/Template.js';

import { Link } from 'react-router-dom';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useLocation } from 'react-router-dom';
const axios = require('axios').default
export const LoginSwapList = ({swap}) => {
    return (
        <>
        <Divider />
        <List>
            <ListItem button key={"SwapLogin"} onClick={swap}>
            <ListItemIcon>
                <AccessibilityIcon/>
            </ListItemIcon>
            <ListItemText primary={"Swap login"} />
            </ListItem>
        </List>
        </>
    );
}

const LangForm = () => {

  const [language, setLanguage] = useCookies(["lng"]);
  const [lang, setLang] = React.useState(typeof language.lng == "undefined"? 'no' : language.lng);
  const [langList, setLangList] = React.useState([]);
  const handleChange = (event) => {
    setLang(event.target.value);
    setLanguage("lng",event.target.value, {path:'/',secure:'true',sameSite:'none'});
    i18next.changeLanguage(event.target.value,(err, t) => {
      if (err) return console.log('something went wrong loading', err);
        t('key'); // -> same as i18next.t
    });
  };

  React.useEffect(() => {
    const fetchLangs = async ()=> {
      await axios({
          method: 'get',
          url: '/api/language',
          withCredentials: true,
      }).then((response)=>{
          setLangList(response.data);
      }).catch(function (error){
          console.log(error)
      })
    }
    fetchLangs();
  }, [])

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 80 }}>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={lang}
          onChange={handleChange}
          autoWidth
        >
          {langList.map((v, k)=>(
            <MenuItem key={k} value={v.language}> {v.languagename} </MenuItem>
          ))}
          {/* <MenuItem value={'no'}> Norsk </MenuItem> */}
          {/* <MenuItem value={'en'}> English </MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
}

export const ColorSwitchList = () => {
  const {t} = useTranslation(); 
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (
        <>
        <Divider />
        <List>
            <ListItem button key={"ColorSwitch"} onClick={colorMode.toggleColorMode}>
            <ListItemIcon>
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={ theme.palette.mode === 'dark' ? t("light_mode"):t('dark_mode')} />
            </ListItem>

            <ListItem button key={"LangSwitch"}>
            <ListItemIcon>
                
            </ListItemIcon>
            <LangForm/>
            </ListItem>
        </List>
        </>
    );
}

const Navigationlist = ({category}) => {

  const {t} = useTranslation();

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
}
const path = usePathname();
const theme = useTheme();
const selectedBG = {
  backgroundColor:theme.palette.mode==='dark' ? 'secondary.dark' : 'secondary.light',
  "&:hover": {
    backgroundColor:'secondary.main',
  },
};
const notSelectedBG = {};
    return (
        <>
        <Divider />
        <List>
        {category.map((element) => (
          <ListItem button sx={path===element.route ? selectedBG : notSelectedBG} key={element.name} component={Link} to={element.route}>
            <ListItemIcon>
              {element.icon}
            </ListItemIcon>
            <ListItemText primary={t(element.name)} />
          </ListItem>
        ))}
        </List>
        </>
    );
};


export default Navigationlist;
