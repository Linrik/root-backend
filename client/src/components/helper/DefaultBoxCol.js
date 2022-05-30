import { Paper } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import Defaultbox from './DefaultBox';

const Defaultboxcol = (props) => {

    const {sx, ...other } = props;
    return (
        <Defaultbox
            sx={{
                flexDirection:"column",
                ...sx,
            }}
            {...other}
        />
    );
};

Defaultboxcol.propTypes = {
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
  };
  

export default Defaultboxcol;
