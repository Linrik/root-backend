import { Box } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Defaultbox = (props) => {
const {sx, ...other } = props;
return (
<Box
    sx={{
        p: 1,
        m: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        borderRadius: '3px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        ...sx,
    }}
    {...other}
/>
);
};

Defaultbox.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};
  

export default Defaultbox;
