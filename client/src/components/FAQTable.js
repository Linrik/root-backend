import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Card, CardContent, CardActions, Collapse, IconButton, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Defaultbox from '../components/helper/DefaultBox';
import {useTranslation} from "react-i18next";

const FAQData = [
    {question: "who_are_we_q", answer: "who_are_we_a"},
    {question: "where_to_comment_article_q", answer: "where_to_comment_article_a"},
    {question: "how_to_join_event_q", answer: "how_to_join_event_a"},
    {question: "wishing_good_day_q", answer: "wishing_good_day_a"}
]


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function FAQCard({question, answer}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ m:1}}>
      
      <CardContent sx={{pl:0}}>
        <CardActions sx={{pl:0}}> 

          {/* Her kommer første spørsmål */}
          <Defaultbox  sx={{justifyContent:'flex-start'}}>
            <Typography variant={"h5"} component={"h5"} color="text.primary">
                {question}
            </Typography>
          </Defaultbox>
        
          <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </CardContent>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
          {/* Her kommer første svar til spørsmål */}
          <Defaultbox  sx={{justifyContent:'flex-start'}}>
            <Typography variant={"h6"} component={"h6"}>
                {answer}
            </Typography>
          </Defaultbox>
      </Collapse>
    </Card>
  );
}

const FAQTable = () => {
  const {t} = useTranslation();
  
    return(
        <Defaultbox sx={{ flexDirection: 'row-reverse', mb:2}}>
            {FAQData.map((e, index)=>(
              <FAQCard key ={e.question+index} question={t(e.question)} answer={t(e.answer)} />
          ))}
        </Defaultbox>
    );
};


FAQTable.propTypes = {

};


export default FAQTable;