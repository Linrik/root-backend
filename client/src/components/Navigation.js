/**
 * Utvikler: Krister
 * Komponent: Redigert variant av eksempel drawer fra Material UI dokumentasjon.
 * Kilde: https://mui.com/components/drawers/#mini-variant-drawer
 * 
 */

import * as React from 'react';
import {useEffect} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';

import { fetchLogin, pagesContext } from '../App';
import Navigationlist, { ColorSwitchList, LoginSwapList } from './NavigationList';
import Footer from './Footer';
import Defaultbox from './helper/DefaultBox';
import { useNavigate, } from "react-router-dom";

import { Suspense } from 'react';
import Loading from '../pages/Loading';
import { LoginContext } from '../routerTemplate/Template';
import axios from 'axios';

// import { loginSession } from '../App';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Navigation = ({Outlet}) => {
    // const {loginStatus} = React.useContext(loginSession);
    const {login, loginMode} = React.useContext(LoginContext);
    useEffect(() => {
        loginMode.Template();
    }, [loginMode]);

    
    let navigate = useNavigate();

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const routes = React.useContext(pagesContext);

    const logOut = async () => {
        
        await axios ({
            method:'get',
            url:"http://localhost:5000/user/logout",
            withCredentials: true
        }).then((response)=>{
            navigate('/login')
        })
        .catch(function (error){
            console.log(error)
        })
    }

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                    <Box component={Link} to={'/'} sx={{mt:'7px'}}>
                    <img src={`https://i.ibb.co/WH2kxFR/Root-Icon2.png?w=16&h=16&fit=crop&auto=format`}
                        srcSet={(`https://i.ibb.co/WH2kxFR/Root-Icon2.png?w=16&h=crop&auto=format&dpr=2 2x`)}
                        alt={"/root"}
                        loading="lazy"
                        style={{ width: '150px', justifySelf:'flex-start'}}
                    />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                </DrawerHeader>

                {/* Meny lister */}
                <Navigationlist category={routes.home} />
                <Navigationlist category={routes.base} />
                {login!==undefined && login.loginStatus===true ? 
                    <>
                    {login.user.editor && <Navigationlist category={routes.editor} />}
                    {login.user.admin && <Navigationlist category={routes.admin} />}
                    <Navigationlist category={routes.loggedIn} />
                    </>
                    :
                    <Navigationlist category={routes.loggedOut} />
                }
                {/* <LoginSwapList swap={logOut} /> */}
                <ColorSwitchList />

            </Drawer>
            <Defaultbox sx={{ m:0,p:0,gap:0,
                justifyContent: 'flex-start',
                flexDirection: 'column',
                minHeight: '100vh',
                flexGrow: 1
            }}>
                <Box component="main" sx={{ flexGrow: 1, p: 0}}>
                    <DrawerHeader />
                    <Suspense fallback={<Loading/>}>
                        <Outlet/>
                    </Suspense>
                </Box>
                <Footer/>
            </Defaultbox>
        </Box>
    );
};


export default Navigation;
