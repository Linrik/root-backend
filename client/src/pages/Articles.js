import React from 'react';
import Grid from '@mui/material/Grid';

import { Box, Paper, Typography, } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';
import Article from "../components/Article";
import { useTranslation } from 'react-i18next';
const axios = require('axios').default

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

const sizeSequence = [
    12, 6, 6, 5, 7, 6, 6, 7, 5, 12, 5, 7
];

//Genererer link til et bilde fra @idemData
function getImage() {
    var random = parseInt(Math.random()*6);
    return itemData[random];
}

const itemData = 
[
    'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62'    
];

const Articles = () => {
    const {t} = useTranslation();
    const [postList, setPostList] = React.useState([]);

    React.useEffect( () => {
        const fetchArticles = async () =>{
            try {
                const request = await axios({
                    method: 'get',
                    url: '/api/article',
                    withCredentials: true,
                })
            setPostList(request.data);
            } catch(e){
                console.log(e);
            }
        }
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
                {postList.map((article, index) =>{
                    if(seqIndex===sizeSequence.length){
                        seqIndex = 0;
                    }
                    const cardImage = article.image===undefined ? `/api/resources/defaultArticle.png` : `/api/resources/${article.image}`;
                    return(
                    <Grid key={article.title + index} item container xs={12} sm={postList.length-1 === article ? true : sizeSequence[seqIndex++]} alignItems="stretch">
                        <Article  className='ArticleTest' image={cardImage} in_post={article} margin={'16px'} />
                    </Grid>
                    )
                })}
                {/* <PushElements items = {postList} /> */}
            </Grid>
        </Defaultbox>
        </Box>
    );
};

export default Articles;
