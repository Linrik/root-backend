import { Button, Collapse, TextField, Typography } from '@mui/material'
import React from 'react'
import Defaultbox from './helper/DefaultBox'
import Defaultboxcol from './helper/DefaultBoxCol'
import {useTranslation} from "react-i18next";
const axios = require('axios').default

const Comment = ({comment, index}) =>{
        
    return(
    <Defaultbox key={index} sx={{borderBottom:1, textAlign:'center', flexDirection:'column'}}>
    <Typography variant="h5" component="h5">
        {comment.user===null ? "deleted_user":comment.user.firstname+" "+comment.user.lastname}
    </Typography>
    <Typography variant="h6" component="h6">
        {comment.comment}
    </Typography>
</Defaultbox>
)}

export default function CommentSection({openComments, commentList, postID, isLoggedIn, fetch}) {

    const { t } = useTranslation();
    const [text, setText] = React.useState("");
    
    const onTextChange = (event) =>{
        setText(event.target.value);
    }

    const sendNewComment = async (event) =>{
        event.preventDefault();
        await axios({
            method: 'post',
            url: "/api/comment/article",
            data: {comment: text, postid: postID},
            withCredentials: true,
        }).then((response)=>{
            setText("");
            fetch();
        }).catch(function (error){
            console.log(error)
        })
    }
    // React.useEffect(() => {


    //     sendNewComment();
    // }, []);

  return (
    <Defaultboxcol>
        <Collapse in={openComments} timeout="auto" unmountOnExit>
            <Defaultboxcol>
                {commentList !== null ?
                 commentList.map((comment, index) => {
                    return(
                        <Comment key={comment.user+index} comment={comment} index={index}></Comment>
                    )
                }) :
                 ""}
                 {isLoggedIn &&
                <form onSubmit={sendNewComment}>
                <Defaultbox sx={{justifyContent:'space-between'}}>
                    <TextField required value={text} onChange={onTextChange} label={t('write_comment')} sx={{flexGrow:6}}> </TextField>
                    <Button variant="outlined" type={'submit'} sx={{flexGrow:1}}>submit</Button>
                </Defaultbox>
                </form>}
            </Defaultboxcol>
        </Collapse>
    </Defaultboxcol>
  )
}
