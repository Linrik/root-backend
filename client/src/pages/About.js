import { Paper, Grid } from '@mui/material';
import React from 'react';
import Defaultbox from '../components/helper/DefaultBox';

import { Card, CardMedia, Typography, CardContent } from '@mui/material';
import { CardActions, Button } from '@mui/material';
import FAQTable from '../components/FAQTable';
import Defaultboxcol from '../components/helper/DefaultBoxCol';
import {useTranslation} from "react-i18next";

// Statisk data for alle predefinerte personer
const rootPeople =[
    {
        firstName: 'Henrik',
        lastName: 'Lindam',
        image: 'https://ae01.alicdn.com/kf/H6d08370e477d44149fcda86a4fffa5c5f/cat-dog-Clothing-Summer-Fashion-Fishnet-Breathable-Cat-Hoodie-Outfit-hiphop-Street-Rabbit-Dog-Cat-cool.jpg_Q90.jpg_.webp',
        role: 'Ikke enda, men det går rykter',
        comment: 'Ønsker seg root merch, så er et mulig fremtidig medlem',
    },    
    {
        firstName: 'Krister',
        lastName: 'Iversen',
        image: 'https://i.ytimg.com/vi/s8hI4k7Z5pA/maxresdefault.jpg',
        role: 'Styremedlem',
        comment: 'Pleier å bli med rundt i klassene og promotere de større root arrangementene, også kjent for sin performance i trackmania',
    },    {
        firstName: 'Olav Pålerud',
        lastName: 'Lille-Østerholt',
        image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c51beb5e-7411-4732-8524-b4466919d0fb/dcbhv3o-e8840e3a-2745-43be-a1f2-a4c2782340e2.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M1MWJlYjVlLTc0MTEtNDczMi04NTI0LWI0NDY2OTE5ZDBmYlwvZGNiaHYzby1lODg0MGUzYS0yNzQ1LTQzYmUtYTFmMi1hNGMyNzgyMzQwZTIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.WmFAY04vb1n1SocRxmlfkT1epUF3PFYyAfsE0FgNU84',
        role: 'Sponsor Ansvarlig',
        comment: 'Mekker mad cash for root',
    },
    {
        firstName: 'Adrian',
        lastName: 'Dahl',
        image: 'https://wallpaperaccess.com/full/2417454.jpg',
        role: 'Root Leder',
        comment: 'Styrer root fra skyggene',
    },
    {
        firstName: 'John Ivar',
        lastName: 'Lilleøren Hagene',
        image: 'https://odditymall.com/includes/content/upload/inflatable-wizard-hat-for-cats-7467.jpg',
        role: 'Workaholick',
        comment: 'Old but gold. Har magiske ferdigheter til å trylle frem tekst.',
    }
]

//Viser returnerer et statisk kort om en person basert på konstanten "rootPeoplle" over
const PersonCard = ({firstName, lastName, image, role, comment, t}) => {
    
    return(
        <Grid item xs={true} sm={6} md={4} lg={3} sx={{minWidth:'275px'}}>
            <Card >
                <CardMedia
                    component="img"
                    height="300"
                    image={image}
                    alt="green iguana person"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {firstName+' '+lastName}
                    </Typography>
                    {'Rolle: '+role}
                    <Typography variant="body2" color="text.secondary">
                    {comment}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button> */}
                </CardActions>
            </Card>
        </Grid>
    );
}

//Returnerer kort om alle predefinerte personer gjennom en .map loop og en FAQ i bunnen
const About = () => {

    const {t} = useTranslation(); 

    return (
        <Defaultboxcol elevation={3} sx={{
            display: "flex",
            p:0,m:0,borderRadius:0,
            minHeight: "100%"
        }}>
            <Defaultbox sx={{
                justifyContent: 'left',
                p: 4,
                m: { sx: 2, sm: 4},
                marginTop: "0px",
                flexDirection: 'column'
            }}>
                <h2>{t('about')+' /root'}</h2>
                <Defaultbox sx={{ width: '100%', p:0, m:0 }}>
                    <Grid container spacing={4} columns={12} sx={{width:"100%" }}>
                        {
                            rootPeople.map((person, index) =>{
                                return(
                                <PersonCard key={person.firstName+index} firstName={person.firstName} lastName={person.lastName} image={person.image} role={person.role} comment={person.comment} t={t}/>
                                )
                            }
                            )
                        }
                    </Grid>
                </Defaultbox>
            </Defaultbox>
            <Defaultbox sx={{width:"100%"}}>
                <FAQTable/>
            </Defaultbox>
        </Defaultboxcol>
    );
};

export default About;
