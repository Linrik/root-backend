import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nopage from './routerTemplate/Nopage';
import Template from './routerTemplate/Template';
import Home from './pages/Home';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import Login from './pages/Login';

import LoginIcon from '@mui/icons-material/Login';
import Register from './pages/Register';

import EventAdmin from './pages/EventAdmin';
import ArticleAdmin from './pages/ArticleAdmin';

import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Articles from './pages/Articles';
import EventIcon from '@mui/icons-material/Event';
import Events from './pages/Events';

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import About from './pages/About';
import Loading from './pages/Loading';
import CachedIcon from '@mui/icons-material/Cached';
import LangAdmin from './pages/LangAdmin';
import TranslateIcon from '@mui/icons-material/Translate';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import Sitelog from './pages/Sitelog';
const axios = require('axios').default;

export const langContext = React.createContext([
"news_route",
"events_route",
"about_us_route",
"profile",
"log_out",
"login",
"register",
"edit_news",
"register_user",
"dark_mode",
"light_mode",
"logger",
"about",
"Event",
"first_name",
"last_name",
"username",
"password",
"forgot_password",
"email",
"repeat_password",
"root_student_association",
"roles",
"role_administrator",
"role_editor",
"role_board_member",
"title",
"author",
"upload",
"post_description",
"submit_post",
"post_title",
"upload_image",
"new_article",
"new_event",
"search_for_title",
"simple_from",
"simple_to",
"new_user",
"admin_page_event",
"admin_page_article",
"cancel",
"join",
"go_to_page",
"events",
"articles",
"going_to",
"login_to_join",
"question_mail_us",
"write_comment",
"start_date",
"start_time",
"end_date",
"end_time",
"edit",
"delete",
"submit",
"admin",
"editor",
"root_member",
"current_password",
"new_password",
"confirm_name",
"confirm_password",
"edit_name",
"edit_password",
"delete_user",
"home",
"article_admin",
"event_admin",
"language_admin",
"profile_page",
"logout",
"who_are_we_q",
"who_are_we_a",
"where_to_comment_article_q",
"where_to_comment_article_a",
"how_to_join_event_q",
"how_to_join_event_a",
"wishing_good_day_q",
"wishing_good_day_a",
"log_admin",
"change_password",
"sure_about_delete",
"delete_user_guide",
"recent_events",
"recent_articles"

])
export const pagesContext = React.createContext({
    home: [
        {
            name: "home",
            route: "/",
            icon: <HomeIcon/>,
            content: <Home/>
        }
    ],
    base: [
        {
            name: "articles",
            route: "/articles",
            icon: <NewspaperIcon/>,
            content: <Articles/>
        },        
        {
            name: "events",
            route: "/events",
            icon: <EventIcon/>,
            content: <Events/>
        },
        {
            name: "about",
            route: "/about",
            icon: <HelpCenterIcon/>,
            content: <About/>
        },
        // {
        //     name: "Loading",
        //     route: "/loading",
        //     icon: <CachedIcon/>,
        //     content: <Loading/>
        // },
    ],
    editor: [
        {
            name: "article_admin",
            route: "/articleadmin",
            icon: <NewspaperIcon/>,
            content: <ArticleAdmin/>
        },
        {
            name: "event_admin",
            route: "/eventadmin",
            icon: <EventIcon/>,
            content: <EventAdmin/>
        },
    ],
    admin: [
        {
            name: "language_admin",
            route: "/langageadmin",
            icon: <TranslateIcon/>,
            content: <LangAdmin/>
        },
        {
            name: "log_admin",
            route: "/log",
            icon: <LogoDevIcon/>,
            content: <Sitelog/>
        },
    ],
    loggedIn: [
        {
            name: "profile_page",
            route: "/profile",
            icon: <PersonIcon/>,
            content: <Profile/>
        },
        {
            name: "logout",
            route: "/logout",
            icon: <LogoutIcon/>,
            content: <Logout/>
        }
    ],
    loggedOut: [
        {
            name: "login",
            route: "/login",
            icon: <LoginIcon/>,
            content: <Login/>
        },
        {
            name: "register",
            route: "/register",
            icon: <AppRegistrationIcon/>,
            content: <Register/>
        }
    ],
});

export const fetchLogin = async () => {
    try {
        const request = await axios({
            method: 'get',
            url: '/api/user',
            withCredentials: true,
        })
        return request.data;
    } catch(e){
        console.log(e);
    }
}

const App = () => {

    const routes = React.useContext(pagesContext);

    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Template />}>
            <Route index element={<Home/>} />
            {routes.base.map(page=>(<Route key={page.name} path={page.route} element={page.content} />))}
            {routes.loggedIn.map(page=>(<Route key={page.name} path={page.route} element={page.content} />))}
            {routes.loggedOut.map(page=>(<Route key={page.name} path={page.route} element={page.content} />))}
            {routes.admin.map(page=>(<Route key={page.name} path={page.route} element={page.content} />))}
            {routes.editor.map(page=>(<Route key={page.name} path={page.route} element={page.content} />))}
            {/* <Route path={"/page2"} element={page.element} /> */}
            <Route path="*" element={<Nopage />} />
        </Route>
        </Routes>
    </BrowserRouter>
    );
};

export default App;

