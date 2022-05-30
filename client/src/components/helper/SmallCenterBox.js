import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import Defaultbox from './DefaultBox';

const Smallcenterbox = (props) => {

    const {sx, ...other } = props;
    return (

        <Defaultbox sx={{
            m:{
                xs:5,
                md:10,
            },
            ...sx,
        }}>
            <Paper elevation={5} sx={{
                width: '100%',
                maxWidth: '428px', 
                borderRadius: '10px'
            }}>
                <Defaultbox {...other} />
            </Paper>
        </Defaultbox>
    );
};

Smallcenterbox.propTypes = {
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
  };
  

export default Smallcenterbox;
