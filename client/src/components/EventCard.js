import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue, green, pink, red, grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import GroupsIcon from '@mui/icons-material/Groups';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCookies } from "react-cookie";
import { DateTime } from 'luxon';
import {useTranslation} from "react-i18next";
import Fade from '@mui/material/Fade';
import { Box } from '@mui/system';
import Defaultbox from './helper/DefaultBox';
import { List, Modal, Avatar } from '@mui/material';
import Paper1200p from './helper/Paper1200p';
import Backdrop from '@mui/material/Backdrop';
import Defaultboxcol from './helper/DefaultBoxCol';
import CloseIcon from '@mui/icons-material/Close';
const axios = require('axios').default

const ExpandMore = styled((post) => {
  const { expand, ...other } = post;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Eventcard({post, in_handlejoinEvent, in_handleCancelEvent, myEventList, isLoggedIn}) {
  
  const { t } = useTranslation();

  const [expanded, setExpanded] = React.useState(false);
  const {title, description, dateFrom, dateTo, image, participants, _id} = post;
  const [participantsCount, setParticipantsCount] = React.useState( participants.length);
  const [cookies, setCookie] = useCookies(["lng"]);
  const [isGoing, setIsGoing] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const cardImage = image===undefined ? `/api/resources/defaultEvent.jpg` : `/api/resources/${image}`;
  const handleOpen = () => {
    setOpenModal(true)};
  const handleClose = () => {
    setOpenModal(false)
  };  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() =>{
    if(isLoggedIn){
      function isInMyEventList(list) {
        var result = list.find(event => event._id === _id);
        if(result !== undefined){
          return true
        }else{
          return false
        }
      }
      setIsGoing(isInMyEventList(myEventList));
    }

  },[_id, isLoggedIn, myEventList, setIsGoing]);

  const handleJoinEvent = async () => {    
    // const result = await joinEvent(_id);
    // console.log(result)
    // if(result.error !== errorResponse.e1 && result.status === 200){
    //   setGoingToEvent(true);
    //   console.log("Event joined")
    // }
  var succsess = in_handlejoinEvent(_id);
  if(succsess){    
    setIsGoing(true);
    setParticipantsCount(participantsCount+1)
  }
}
const handleCancelEvent = async () => {
  var succsess = in_handleCancelEvent(_id);
  if(succsess){    
    setIsGoing(false);
    setParticipantsCount(participantsCount-1)
  }
}

  return (
    <Box>
      <Card sx={{width: 275, whiteSpace: 'nowrap'}}>

        <CardHeader
          disableTypography={true}
          title={ 
            <Typography overflow='hidden' variant='h6' component='h2' sx={{maxWidth:'200px', textOverflow:'ellipsis', textAlign:'center'}} >
              {title}
            </Typography>
          }
          
        />
        
        <CardMedia
          component="img"
          height="194"
          image={cardImage}
          alt="unloaded image"
        />
        
        <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
              {DateTime.fromISO(dateFrom).setLocale(cookies.lng).toLocaleString(DateTime.DATETIME_SHORT)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
              {' - '}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
              {DateTime.fromISO(dateTo).setLocale(cookies.lng).toLocaleString(DateTime.DATETIME_SHORT)}
            </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <Box onClick={handleOpen} >
            {participantsCount}
            <IconButton aria-label="add to favorites">
              <GroupsIcon sx={{ color: blue[300] }} />
            </IconButton>
          </Box>

        {isLoggedIn ? 

          <IconButton onClick={() => isGoing? handleCancelEvent() : handleJoinEvent()}>
            <Switch checked={isGoing} color="success" />
            <Typography sx={{ color: isGoing & green[500] }}>
              {t( isGoing ?  'cancel' : 'join')}
            </Typography>
          </IconButton> 

          :

          <IconButton>          
            <Switch checked={false}/>
            <Typography>
              {t('login_to_join')}
            </Typography>
          </IconButton>
        } 
          
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent >
            <Typography paragraph variant='h5' sx={{whiteSpace:'initial', borderBottom:'1px solid'}}>{title}</Typography>
            <Typography paragraph sx={{whiteSpace:'initial'}}>
              {description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
      <Modal
        open={openModal}
        onClose={handleClose}    
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        keepMounted 
        
      >
      <Fade in={openModal}>
      <Box sx={{  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  p: 4, outline:0, width:'100%', maxWidth:'1200px'}}>
        <Paper1200p>
          <Box sx={{boxShadow: 24, backgroundImage: `url("${cardImage}")`, backgroundRepeat:'no-repeat', backgroundAttachment:'fixed', backgroundSize:'cover', width:'100%', height:'300px', backgroundPosition:'center center'}}>
          <IconButton 
              aria-label="close" 
              onClick={handleClose} >
                <Avatar sx={{backgroundColor: grey[500],}}> 
                  <CloseIcon />
                </Avatar>
          </IconButton>
          </Box>
          <Defaultbox sx={{flexDirection:'column', alignContent:'center'}}>            
            <Typography variant="h3" component="h2" sx={{borderBottom:'1px solid'}}>
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {t('going_to')}
            </Typography>


            <List sx={{textAlign:'center'}}>
              {participants.map((person, index) => {    
                return(         
                <Typography key={person._id + index} sx={{ mb: 2 }}>
                  {person.firstname +' '+ person.lastname}
                </Typography>
                )
              })}
            </List>
          </Defaultbox>
        </Paper1200p>
      </Box>
      </Fade>
    </Modal>
  </Box>
  );
}