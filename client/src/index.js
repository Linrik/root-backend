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

//NPM i18next og alle hjelpe pakkene til den initialiseres. Vi bruker LanguageDetector for automatisk sjekke standardspråk
//på datamaskinen, ellers sjekker siden etter en cookie som bruker kan oppdatere gjennom gui.
//i18Next brukes i koden som {t('nøkkelord')}
//Løsningen er bygget på følgende guide: https://www.youtube.com/watch?v=w04LXKlusCQ og dokumentasjon

i18n 
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
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

//Suspense blir brukt i tilfelle hvor nettsiden ikke klarer eller venter å lastes inn, her har vi definert det som en loading bar.
//CookiesProvider er en pakke som gjør det mulig å akksessere cookies over hele appen
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
