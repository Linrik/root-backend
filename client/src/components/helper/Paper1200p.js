import { Paper } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Paper1200p = (props) => {

    const {sx, ...other } = props;
    return (
        <Paper evelation = {5}
            sx={{
                m:2, maxWidth:'1200px', margin:'auto',
                ...sx,
            }}
            {...other}
        />
    );
};

Paper1200p.propTypes = {
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
  };
  

export default Paper1200p;
