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

i18n 
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // supportedLngs: langs,
        fallbackLng: "no",
        detection: {
            order: ['cookie',],
            lookupCookie:"lng"
        },
        caches: ['cookie'],
        backend: {
            loadPath: '/api/language/i18/{{lng}}'
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
