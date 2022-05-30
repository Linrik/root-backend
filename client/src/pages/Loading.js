import { Box } from '@mui/material';
import React from 'react';

import LinearProgress from '@mui/material/LinearProgress';

// En loadingbar, brukt på alle sider for å vise at en nettside loader
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
        </Box>
    );
};

export default Loading;
