import React from 'react';

import { Outlet } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useCookies } from "react-cookie";
import Navigation from '../components/Navigation';
import { fetchLogin } from '../App';

// Dette komponentet setter hva som skal vises for alle sider i hele applikasjonen

// Konfigurasjon for å oppdatere Login state og Farge state for hele applikasjonen
export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
export const LoginContext = React.createContext({ Template: () => {} })
const Template = () => {
  const [login, setLogin] = React.useState({loggedIn:false, user:null});
  const loginMode = React.useMemo(
    () => ({
      Template: async () => {
        const data = await fetchLogin();
        setLogin(()=>data);
      },
    }),
    [],
  );
    return (
        <>
          <LoginContext.Provider value={{login, loginMode}}>
            <Navigation Outlet={Outlet}/>
          </LoginContext.Provider>
        </>
    );
};

// Komponent som holder på farge instillinger og sender dette videre ned i applikasjonen
const ToggleColorMode = () => {

    const [cookies, setCookie] = useCookies(["colormode"]);
    const [mode, setMode] = React.useState(cookies.colormode);

    // Oppsett og bruk av cookie som husker på fargetema
    const handleColorModeCookie = (current) => {
        if(current!=='light' && current!=='dark'){
          current='light';
        }
        const newColor = current==='light' ? 'dark' : 'light';
        setCookie("colormode", newColor, {path: '/', secure: true, sameSite: 'none'})
        return newColor;
    }

    const colorMode = React.useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => handleColorModeCookie(prevMode));
        },
      }),
      [],
    );
  
    const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode,
          },
        }),
      [mode],
    );
  
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Template />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
}

export default ToggleColorMode;
