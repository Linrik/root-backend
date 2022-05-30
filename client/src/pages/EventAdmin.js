import React from 'react';
import {Button, List} from '@mui/material';
import {useTranslation} from "react-i18next";
import ArticleForm from '../components/ArticleForm';
import Defaultbox from '../components/helper/DefaultBox';
import ThumbnailPost from '../components/ThumbnailPost';
import { DateTime } from 'luxon';
import { TextField, Typography } from '@mui/material';
import Paper1200p from '../components/helper/Paper1200p';
import Spacebetween from '../components/helper/SpaceBetween';
const axios = require('axios').default

const EventAdmin = () => {

    const { t } = useTranslation();
    const [postList, setPostList] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [form, setForm] = React.useState();

    const [search, setSearch] = React.useState("");

    /*Metode som filtrerer listen med arrangementer mot et bestemt arrangement og oppdaterer listen ved gjennomført axios kall.
      Axios kallet er en request om å slette bestemt arrangement basert på arrangement ID. */
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
            setPostList(newPostList);
        }).catch(function (e){
            console.log(e)
        })

    }

    /* */
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