import React from 'react';
import PropTypes from 'prop-types';
import Defaultbox from './DefaultBox';

const Spacebetween = (props) => {

    const {sx, ...other } = props;
    return (
        <Defaultbox
            sx={{
                width:'100%', justifyContent:"space-between", alignItems:'center',
                ...sx,
            }}
            {...other}
        />
    );
};

Spacebetween.propTypes = {
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
  };
  

export default Spacebetween;
