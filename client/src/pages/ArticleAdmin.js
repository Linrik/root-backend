import React from 'react';
import {Paper, Button, Box, List, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import ArticleForm from '../components/ArticleForm';
import Defaultbox from '../components/helper/DefaultBox';
import ThumbnailPost from '../components/ThumbnailPost';
import { DateTime } from 'luxon';
import { TextField } from '@mui/material';
import Paper1200p from '../components/helper/Paper1200p';
import Spacebetween from '../components/helper/SpaceBetween';
const axios = require('axios').default

// Adminside for redigering av eksisterende arrangementer og opretting av nye
const ArticleAdmin = () => {

    const { t } = useTranslation();
    
    const [articleList, setArticleList] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [form, setForm] = React.useState();

    const [search, setSearch] = React.useState("");

    // Metode for sletting av arrangement, sender delete request til backend med eventID og fjerner komponentet fra frontend
    const handleDelete = async (postID) => {
        const newPostList = articleList.filter((item) => item._id !== postID);

        const route = "/api/article";
        const dataInput = {articleid: postID}
        console.log(postID);

        await axios({
            method: 'delete',
            url: route,
            data: dataInput,
            withCredentials: true,
        }).then((response)=>{
            console.log(response)
        }).catch(function (error){
            console.log(error)
        })

        setArticleList(newPostList);
    }

    
    // Metode for redigering av arrangement: opretter og åpner en redigeringsboks med info om arrangementet og en metode for backend 
    function handleEdit(postID) {
        const postItem = articleList.find((item) => item._id === postID);
        console.log('"Edit Post" Clicked', postItem.id)
        setForm(
            <ArticleForm 
                setShowForm = {setShowForm}
                in_postTitle = {postItem.title}
                in_postDescription = {postItem.description}
                isNewPost = {false}
                in_id = {postItem._id}
                fetch={fetchArticles}
            />
        );
        setShowForm(!showForm);        
    }

    // Metode som henter alle artikler fra backend med et axios kall og oppdaterer liste med artikler med "setArticleList"
    const fetchArticles = async () =>{
        try {
            const request = await axios({
                method: 'get',
                url: '/api/article',
                withCredentials: true,
            })
            setArticleList(request.data);
        } catch(e){
            console.log(e);
        }
    }
    React.useEffect(() => {
        fetchArticles();
    }, [setArticleList, t]);
    
    // Metode for hente  
    function handleNewPost() {
        setForm(<ArticleForm fetch={fetchArticles} setShowForm = {setShowForm} in_isNewPost={true} isEvent={false}/>);
        setShowForm(true);
    }
        return (
            <>
            <Paper1200p>
                <Spacebetween>
                    <Typography variant="h2" >{t('admin_page_article')}</Typography>
                    <SearchBox setSearch={setSearch} t={t}/>
                </Spacebetween>
                <PostList handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            postList={articleList}
                            search={search} />
            </Paper1200p>    
            
            <Defaultbox id = 'form-box'>
                    {!showForm ? 
                        <Button variant="outlined" onClick={handleNewPost}> {t('new_article')}</Button> 
                        : form}
            </Defaultbox>    
            </>
        );
};

// Komponent med tekstfelt for å søke etter artikkel tittel
const SearchBox = ({setSearch, t}) => {
    const changeSearch = (e) => {
        setSearch(e.target.value);
    }
    return (
        <Defaultbox>
            <TextField id="input" label={t('search_for_title')} variant="outlined" onChange={changeSearch}/>
        </Defaultbox>
    );
}

const PostList = ({handleDelete, handleEdit, postList, search}) =>{
    const filterPost = postList.filter(v => {
        return v.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    })
    return(
    <List sx= {{maxHeight:'800px', overflow:'auto'}}>
        {filterPost.map((p, index)=>(
            <ThumbnailPost key={p.title+index} post={p} handleDelete = {handleDelete} handleEdit = {handleEdit} isEvent = {false}/>
        ))}
    </List> 
    )
}

export default ArticleAdmin;