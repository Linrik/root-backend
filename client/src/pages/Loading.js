import { Box } from '@mui/material';
import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import LinearProgress from '@mui/material/LinearProgress';

const Loading = () => {
    return (
        <Box sx={{
            minWidth: "100vw",
            position: "fixed",
            zIndex: '1000'
        }}>
            <LinearProgress sx={{
                height: "8px"
            }}/>
            {/* <CircularProgress /> */}
        </Box>
    );
};

export default Loading;
