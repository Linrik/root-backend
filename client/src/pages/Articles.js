import React from 'react';
import Grid from '@mui/material/Grid';

import { Box, Typography, } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';
import Article from "../components/Article";
import { useTranslation } from 'react-i18next';
const axios = require('axios').default

//en predefinert liste som bestemmer mønster for størrelsefordeling av komponenter i artikkelsiden i et grid med 12 i størrelse
const sizeSequence = [
    12, 6, 6, 5, 7, 6, 6, 7, 5, 12, 5, 7
];

// returnerer et Grid med artikler hentet fra databasen 
const Articles = () => {
    const {t} = useTranslation();
    const [postList, setPostList] = React.useState([]);

    const fetchArticles = async () =>{
        try {
            const request = await axios({
                method: 'get',
                url: '/api/article',
                withCredentials: true,
            })
        setPostList(request.data);
        console.log("article satt 1")
        } catch(e){
            console.log(e);
        }
    }

    React.useEffect( () => {
        /*axios request for å hente artikler fra datbase og lagre i postList*/
        fetchArticles();       

    }, [setPostList]);
    
    
    var seqIndex = 0;
    return (
        <Box>
        <Defaultbox>
            <Typography variant="h2">{t('articles')}</Typography>
        </Defaultbox>
        <Defaultbox sx={{
            justifyContent:'center',
            width: '100%',
            m:0
        }}>
            <Grid  container columns={12}
                alignItems="stretch"
                sx={{maxWidth:'1200px',}}>
                {/* En .map() loop som lager alle artiklene og bestemmer størrelsen basert på mønsteret i "sizeSequence".
                    Metoden sjekker også om artikkel har et bilde, og sender et default bilde ved mangel*/}
                {postList.map((article, index) =>{
                    if(seqIndex===sizeSequence.length){
                        seqIndex = 0;
                    }
                    const cardImage = article.image===undefined ? `/api/resources/defaultArticle.png` : `/api/resources/${article.image}`;
                    return(
                    <Grid key={article.title + index} item container xs={12} sm={postList.length-1 === article ? true : sizeSequence[seqIndex++]} alignItems="stretch">
                        <Article  className='ArticleTest' fetch={fetchArticles} image={cardImage} in_post={article} margin={'16px'} />
                    </Grid>
                    )
                })}
            </Grid>
        </Defaultbox>
        </Box>
    );
};

export default Articles;
