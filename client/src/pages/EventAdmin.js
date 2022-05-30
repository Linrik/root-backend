import React from 'react';
import {Paper, Button, Box, List} from '@mui/material';
import {useTranslation} from "react-i18next";
import ArticleForm from '../components/ArticleForm';
import Defaultbox from '../components/helper/DefaultBox';
import ThumbnailPost from '../components/ThumbnailPost';
import { DateTime } from 'luxon';
import { TextField, Typography } from '@mui/material';
import Paper1200p from '../components/helper/Paper1200p';
import Spacebetween from '../components/helper/SpaceBetween';
const axios = require('axios').default


const itemData = 
[
    'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62'    
];
function getImage() {
    var random = parseInt(Math.random()*6);
    return itemData[random];
}

const EventAdmin = () => {

    const { t } = useTranslation();
    const [postList, setPostList] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [form, setForm] = React.useState();

    const [search, setSearch] = React.useState("");

    const handleDelete = async (postID) => {
        
        const newPostList = postList.filter((item) => item._id !== postID);
        
        const route = "/api/event";
        const dataInput = {eventid: postID}
        
        await axios({
            method: 'delete',
            url: route,
            data: dataInput,
            withCredentials: true,
        }).then((response)=>{
            setShowForm(false);
            fetchEvents();
        }).catch(function (e){
            console.log(e)
        })

        setPostList(newPostList);
    }

    function handleEdit(postID) {
        const postItem = postList.find((item) => item._id === postID);
        const startDT = new Date( DateTime.fromISO(postItem.dateFrom))
        const endDT = new Date( DateTime.fromISO(postItem.dateTo))
        setForm(
            <ArticleForm 
                setShowForm = {setShowForm}
                in_postTitle = {postItem.title}
                in_postDescription = {postItem.description}
                in_startDate = {startDT}
                in_startTime = {startDT}
                in_endDate = {endDT}
                in_endTime = {endDT}
                in_isNewPost = {false}
                in_id = {postItem._id}
                fetch={fetchEvents}
                isEvent
            />
        );
        setShowForm(!showForm)
        // .scrollIntoView()
    }

    const fetchEvents = async () =>{
        try {
            const request = await axios({
                method: 'get',
                url: '/api/event',
                withCredentials: true,
            })
        setPostList(request.data);
        } catch(e){
            console.log(e);
        }

    }

    React.useEffect( () => {
        setShowForm(false);
        fetchEvents();
    }, [setPostList, t]);
    
    function handleNewPost() {
        setForm(<ArticleForm fetch={fetchEvents} setShowForm = {setShowForm} isEvent = {true} in_isNewPost = {true}/>);
        setShowForm(true);
    }
        return (
            <>
            <Paper1200p>
                <Spacebetween>
                    <Typography variant="h2">{t('admin_page_event')}</Typography>
                    <SearchBox setSearch={setSearch} t={t}/>
                </Spacebetween>
                <PostList 
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    postList={postList}
                    search={search}
                    isEvent={true}
                />
            </Paper1200p>    
            
            <Defaultbox id = 'form-box'>
                    {!showForm ? 
                        <Button size="large" variant="outlined" onClick={handleNewPost}> {t('new_event')}</Button> 
                        : form}
            </Defaultbox>    
            </>
        );
};

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
            <ThumbnailPost key={p.title+index} post={p} handleDelete = {handleDelete} handleEdit = {handleEdit} isEvent = {true}/>
        ))}
    </List> 
    )
}

ArticleForm.defaultProps = {
    isEvent: false,
    isArticle: false
}

export default EventAdmin;