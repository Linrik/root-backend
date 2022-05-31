import React from 'react';
import { Avatar, Box, Collapse, Icon, IconButton, Modal, Paper, Typography, } from '@mui/material';
import Defaultbox from '../components/helper/DefaultBox';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Defaultboxcol from './helper/DefaultBoxCol';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CommentSection from './CommentSection';
import { LoginContext } from '../routerTemplate/Template';
import { blue, grey} from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';

const Article = ({in_post, margin, fetch}) => {  
  const {_id, comments, image, description, title} = in_post;  
  const [open, setOpen] = React.useState(false); 
  const [openComments, setOpenComments] = React.useState(false);
  const {login, loginMode} = React.useContext(LoginContext);
  const cardImage = image===undefined ? `/api/resources/defaultArticle.png` : `/api/resources/${image}`;
  const handleOpen = () => {
    setOpen(true)};
  const handleClose = () => {
    setOpen(false)
  };

    const s={padding:3, fontWeight: 700,
    letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0}
  
    // Returnerer ferdig artikkel komponent basert på informasjon i "in_post" variabelen, og margin basert på innput variabel "margin" 
  return (
    <Paper elevation={5} sx={{m: {margin}, borderRadius:3, overflow:'hidden', width: "100%", maxHeight:'500px'}}>
      <Box onClick={handleOpen}
        sx={{display:'flex', flexWrap:'wrap', flexDirection:'row'}}
      >
        
        <Box sx={{
          backgroundImage: `url("${cardImage}")`,
          backgroundRepeat:'no-repeat',
          backgroundSize:'cover',
          width:'100%', minHeight:'300px',
          backgroundPosition:'center center'}}>
        </Box>
        <Defaultbox width='100%' sx={{display:'flex', flex:'1 1 auto', }}>
          <Typography variant="body1"  sx={{s,  fontSize:{xs:'25px', md:'35px'}}}>
            {title}
          </Typography>
        </Defaultbox>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}    
        closeAfterTransition
        BackdropComponent={Backdrop}
        
        BackdropProps={{
          timeout: 500,
        }}
        keepMounted 
        
      >
        <Fade Fade in={open}>
          <Box sx={{m:0, p:0}}>
            <Paper sx={{ maxWidth:'1200px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline:0, width:'100%', maxHeight:'100vh', overflow:'scroll'}}>
              <Box sx={{
                backgroundImage: `url("${cardImage}")`,
                backgroundRepeat:'no-repeat', 
                backgroundAttachment:'fixed', 
                backgroundSize:'contain',
                minWidth:'600px', minHeight:'400px', 
                backgroundPosition:'center center'}}>
              <IconButton 
                  aria-label="close" 
                  onClick={handleClose} >
                    <Avatar sx={{backgroundColor: grey[500],}}> 
                      <CloseIcon />
                    </Avatar>
              </IconButton>
              </Box>
              <Defaultboxcol sx={{mb:0, pb:0}}>
                <Typography variant="h3" component="h2" sx={{borderBottom:'1px solid'}}>
                  {title}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {description}
                </Typography>

                <IconButton size="small" onClick={() => setOpenComments(!openComments)} sx={{mb:0, pb:0}}>
                  {openComments ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Defaultboxcol>
              
              <CommentSection openComments={openComments} fetch={fetch} commentList={comments} postID={in_post._id} isLoggedIn={login.loginStatus}/>
            </Paper>
        </Box>
      </Fade>
    </Modal>
    </Paper>
  );
}

export default Article;  