import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CookiesProvider } from "react-cookie";
import App from './App';
import i18n from "i18next";
import { initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import Loading from './pages/Loading';

// const axios = require('axios').default
// const fetchSuppLangList = () => {
//     axios({
//         method: 'get',
//         url: "http://localhost:5000/language",
//         withCredentials: true,
//     }).then((response)=>{
//         let supported = [];
//         for(let i = 0; i<response.data.length; i++){
//             supported[i] = response.data[i].language;
//         }
//         console.log(supported)
//         return supported;
//     }).catch(function (error){
//         console.log(error)
//     })
// }
// const langs = fetchSuppLangList();
// console.log(langs)
i18n 
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        // supportedLngs: langs,
        fallbackLng: "no",
        detection: {
            order: ['cookie',],
            lookupCookie:"lng"
        },
        caches: ['cookie'],
        backend: {
            // loadPath: '/assets/locales/{{lng}}/translation.json',
            loadPath: 'http://localhost:5000/language/i18/{{lng}}'
        },
    });

ReactDOM.render(
        <Suspense fallback={<Loading/>}>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </Suspense>,
  document.getElementById('root')
);

/**
 * OlavPL
 * Linrik
 * Johlil9
 * DahlGitHub
 * Bjelke98
 */
